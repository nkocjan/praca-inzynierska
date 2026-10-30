import { useEffect, useRef, useState } from "react";
import {
  Box,
  FormLabel,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { apiClient } from "../../../../api/apiClient";
import type {
  BudgetCreateRequestUiDTO,
  CategoryUiDTO,
  GetDefaultBudgetsResponseUiDTO,
} from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatCurrencyPLN, formatDate, getCurrencySymbol } from "../../../../i18n/locale";
import { Dot } from "../../../../lib/filters/FilterParts";
import { useCategoryColors } from "../../../../theme/chartColors";
import { BudgetPeriodType, PERIOD_TYPES } from "../budgetFilters";

interface AddBudgetFormProps {
  formId: string;
  categoryId?: string;
  onSuccess: () => void;
}

const DEFAULT_KEY: Record<BudgetPeriodType, keyof GetDefaultBudgetsResponseUiDTO> = {
  WEEK: "weeklyAmount",
  MONTH: "monthlyAmount",
  YEAR: "yearlyAmount",
};

// Monday to Sunday, the same boundaries as the backend.
const weekRange = (date: Dayjs) => {
  const start = date.subtract((date.day() + 6) % 7, "day");
  return { start, end: start.add(6, "day") };
};

const AddBudgetForm = ({ formId, categoryId, onSuccess }: AddBudgetFormProps) => {
  const { t, i18n } = useTranslation("budgets");
  const language = normalizeLanguage(i18n.language);
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<CategoryUiDTO[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [defaults, setDefaults] = useState<GetDefaultBudgetsResponseUiDTO | null>(null);
  // Once the user types an amount, a change of category or period no longer overwrites it.
  const amountTouched = useRef(false);
  const { colorFor } = useCategoryColors(categories, language);

  useEffect(() => {
    apiClient
      .get<CategoryUiDTO[]>("/api/bff/categories/combo")
      .then(response => setCategories(response.data))
      .catch(error => {
        console.error("Błąd podczas pobierania kategorii:", error);
        enqueueSnackbar(t("snackbar.categoriesFetchError"), { variant: "error" });
      })
      .finally(() => setLoadingCategories(false));
  }, [enqueueSnackbar, t]);

  const formik = useFormik({
    initialValues: {
      categoryId: categoryId ?? "",
      period: "MONTH" as BudgetPeriodType,
      date: dayjs() as Dayjs | null,
      amount: "" as number | "",
    },
    validationSchema: Yup.object({
      categoryId: Yup.string().required(t("validation.categoryRequired")),
      date: Yup.mixed<Dayjs>().nullable().required(t("validation.dateRequired")),
      amount: Yup.number().min(0.01, t("validation.amountMin")).required(t("validation.amountRequired")),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const request: BudgetCreateRequestUiDTO = {
          categoryId: values.categoryId,
          period: values.period,
          amount: Number(values.amount),
          date: (values.date ?? dayjs()).format("YYYY-MM-DD"),
        };
        await apiClient.post("/api/bff/budgets", request);
        enqueueSnackbar(t("snackbar.budgetSaved"), { variant: "success" });
        onSuccess();
      } catch (error) {
        console.error("Błąd podczas zapisywania budżetu:", error);
        enqueueSnackbar(t("snackbar.budgetSaveError"), { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { setFieldValue } = formik;
  const selectedCategory = formik.values.categoryId;
  const period = formik.values.period;

  useEffect(() => {
    setDefaults(null);
    if (!selectedCategory) return;
    let ignore = false;
    apiClient
      .get<GetDefaultBudgetsResponseUiDTO>(`/api/bff/budgets/get-defaults/${selectedCategory}`)
      .then(response => {
        if (!ignore) setDefaults(response.data);
      })
      .catch(error => console.error("Błąd podczas pobierania domyślnych limitów:", error));
    return () => {
      ignore = true;
    };
  }, [selectedCategory]);

  const defaultAmount = defaults?.[DEFAULT_KEY[period]];

  useEffect(() => {
    if (!amountTouched.current && defaultAmount !== undefined) {
      void setFieldValue("amount", defaultAmount);
    }
  }, [defaultAmount, setFieldValue]);

  const fieldError = (field: "categoryId" | "amount") =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : undefined;

  const pickerProps = {
    WEEK: { views: ["year", "month", "day"] as const, label: t("form.week"), format: undefined },
    MONTH: { views: ["year", "month"] as const, label: t("form.month"), format: "MMMM YYYY" },
    YEAR: { views: ["year"] as const, label: t("form.year"), format: "YYYY" },
  }[period];

  const week = formik.values.date ? weekRange(formik.values.date) : null;
  const weekLabel = week
    ? t("form.weekRange", {
        range: `${formatDate(week.start, language, "D MMM")} - ${formatDate(week.end, language, "D MMM YYYY")}`,
      })
    : undefined;

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ pt: 1 }}>
      <Grid
        container
        spacing={2}>
        <Grid size={12}>
          <TextField
            select
            label={t("form.category")}
            fullWidth
            name="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(fieldError("categoryId"))}
            helperText={fieldError("categoryId")}
            disabled={formik.isSubmitting || loadingCategories}
            slotProps={{
              select: {
                renderValue: value => {
                  const category = categories.find(item => item.id === value);
                  return (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}>
                      <Dot color={colorFor(category?.id)} />
                      <span>{category?.name}</span>
                    </Stack>
                  );
                },
              },
            }}>
            {loadingCategories && (
              <MenuItem
                disabled
                value="">
                {t("form.categoriesLoading")}
              </MenuItem>
            )}
            {categories.map(category => (
              <MenuItem
                key={category.id}
                value={category.id}
                sx={{ gap: 1.25 }}>
                <Dot color={colorFor(category.id)} />
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={12}>
          <FormLabel
            id="budget-period-type-label"
            sx={{ display: "block", mb: 1, typography: "body2", fontWeight: 500 }}>
            {t("form.periodType")}
          </FormLabel>
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={period}
            aria-labelledby="budget-period-type-label"
            disabled={formik.isSubmitting}
            onChange={(_event, value: BudgetPeriodType | null) => value && void setFieldValue("period", value)}>
            {PERIOD_TYPES.map(type => (
              <ToggleButton
                key={type}
                value={type}>
                {t(`form.periodTypes.${type}`)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            key={period}
            label={pickerProps.label}
            views={pickerProps.views}
            openTo={period === "WEEK" ? "day" : period === "MONTH" ? "month" : "year"}
            format={pickerProps.format}
            value={formik.values.date}
            onChange={(date: Dayjs | null) => void setFieldValue("date", date)}
            disabled={formik.isSubmitting}
            slotProps={{
              textField: {
                fullWidth: true,
                error: Boolean(formik.touched.date && formik.errors.date),
                helperText:
                  formik.touched.date && formik.errors.date
                    ? String(formik.errors.date)
                    : period === "WEEK"
                      ? weekLabel
                      : undefined,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={t("form.amount")}
            type="number"
            fullWidth
            name="amount"
            value={formik.values.amount}
            onChange={event => {
              amountTouched.current = true;
              formik.handleChange(event);
            }}
            onBlur={formik.handleBlur}
            error={Boolean(fieldError("amount"))}
            helperText={
              fieldError("amount") ??
              (defaultAmount !== undefined
                ? t("form.defaultHint", { amount: formatCurrencyPLN(defaultAmount, language, 0) })
                : undefined)
            }
            disabled={formik.isSubmitting}
            slotProps={{
              input: { endAdornment: <InputAdornment position="end">{getCurrencySymbol(language)}</InputAdornment> },
              htmlInput: { min: 0, step: "0.01", inputMode: "decimal" },
            }}
          />
        </Grid>

        <Grid size={12}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ color: "text.secondary" }}>
            <InfoOutlinedIcon sx={{ fontSize: 18, mt: "2px" }} />
            <Typography variant="body2">{t("form.addHint")}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddBudgetForm;
