import { useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
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

import { apiClient } from "../../../../api/apiClient.ts";
import {
  CategoryUiDTO,
  CreateExpenseRequestUiDTO,
  UpdateExpenseRequestUiDTO,
} from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { getCurrencySymbol } from "../../../../i18n/locale";
import { useCategoryColors } from "../../../../theme/chartColors";

interface properties {
  isEdit?: boolean;
  id?: string;
  name?: string;
  description?: string;
  category?: { id?: string; name?: string };
  amount?: number;
  date?: Dayjs;
  planned?: boolean;
  onSuccess: () => void;
  formId?: string;
}

const AddExpenseForm = (props: properties) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation("expenses");
  const language = normalizeLanguage(i18n.language);

  const validationSchema = Yup.object({
    name: Yup.string().trim().required(t("validation.nameRequired")),
    category: Yup.string().required(t("validation.categoryRequired")),
    amount: Yup.number().min(0.01, t("validation.amountMin")).required(t("validation.amountRequired")),
    date: Yup.mixed<Dayjs>().nullable().required(t("validation.dateRequired")),
    planned: Yup.boolean(),
    description: Yup.string().max(255, t("validation.descriptionMax")),
  });

  const [categories, setCategories] = useState<CategoryUiDTO[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { colorFor } = useCategoryColors(categories, language);

  useEffect(() => {
    apiClient
      .get<CategoryUiDTO[]>("/api/bff/categories/combo")
      .then(response => setCategories(response.data))
      .catch(error => {
        console.error("Nie udało się pobrać kategorii:", error);
        enqueueSnackbar(t("snackbar.categoriesFetchError"), { variant: "error" });
      })
      .finally(() => setLoadingCategories(false));
  }, [enqueueSnackbar, t]);

  const formik = useFormik({
    initialValues: {
      name: props.name ?? "",
      description: props.description ?? "",
      category: props.category?.id ?? "",
      amount: props.amount ?? "",
      date: props.date ? dayjs(props.date) : dayjs(),
      planned: props.planned ?? false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const localDateTimeString = values.date.format("YYYY-MM-DDTHH:mm:ss");

        if (props.isEdit) {
          if (!props.id) {
            throw new Error("Brak ID wydatku podczas próby edycji.");
          }
          const requestBody: UpdateExpenseRequestUiDTO = {
            name: values.name.trim(),
            description: values.description,
            amount: Number(values.amount),
            date: localDateTimeString,
          };
          await apiClient.put(`/api/bff/expenses/${props.id}`, requestBody);
          enqueueSnackbar(t("snackbar.expenseUpdated"), { variant: "success" });
        } else {
          const requestBody: CreateExpenseRequestUiDTO = {
            name: values.name.trim(),
            description: values.description,
            amount: Number(values.amount),
            date: localDateTimeString,
            categoryId: values.category,
            isPlanned: values.planned,
          };
          await apiClient.post("/api/bff/expenses", requestBody);
          enqueueSnackbar(t("snackbar.expenseAdded"), { variant: "success" });
        }
        props.onSuccess();
      } catch (error) {
        console.error("Błąd podczas zapisywania wydatku:", error);
        enqueueSnackbar(t("snackbar.expenseSaveError"), { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fieldError = (field: "name" | "category" | "amount" | "description") =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : undefined;

  return (
    <Box
      component="form"
      id={props.formId}
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ pt: 1 }}>
      <Grid
        container
        spacing={2}>
        <Grid size={12}>
          <TextField
            label={t("form.name")}
            placeholder={t("form.namePlaceholder")}
            fullWidth
            autoFocus
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(fieldError("name"))}
            helperText={fieldError("name")}
            disabled={formik.isSubmitting}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={t("form.amount")}
            type="number"
            fullWidth
            name="amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(fieldError("amount"))}
            helperText={fieldError("amount")}
            disabled={formik.isSubmitting}
            slotProps={{
              input: { endAdornment: <InputAdornment position="end">{getCurrencySymbol(language)}</InputAdornment> },
              htmlInput: { min: 0, step: "0.01", inputMode: "decimal" },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label={t("form.date")}
            value={formik.values.date}
            onChange={(date: Dayjs | null) => formik.setFieldValue("date", date ? dayjs(date) : null)}
            disabled={formik.isSubmitting}
            slotProps={{
              textField: {
                fullWidth: true,
                error: Boolean(formik.touched.date && formik.errors.date),
                helperText: formik.touched.date && formik.errors.date ? String(formik.errors.date) : undefined,
              },
            }}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            select
            label={t("form.category")}
            fullWidth
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(fieldError("category"))}
            helperText={fieldError("category")}
            disabled={props.isEdit || formik.isSubmitting || loadingCategories}
            slotProps={{
              select: {
                renderValue: value => {
                  const category = categories.find(item => item.id === value);
                  return (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}>
                      <Box
                        aria-hidden
                        sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: colorFor(category?.id) }}
                      />
                      <span>{category?.name ?? props.category?.name}</span>
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
                <Box
                  aria-hidden
                  sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: colorFor(category.id) }}
                />
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={12}>
          <TextField
            label={t("form.descriptionOptional")}
            fullWidth
            multiline
            minRows={2}
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(fieldError("description"))}
            helperText={fieldError("description")}
            disabled={formik.isSubmitting}
          />
        </Grid>

        <Grid size={12}>
          {props.isEdit ? (
            <Stack
              direction="row"
              spacing={1}
              sx={{ color: "text.secondary" }}>
              <InfoOutlinedIcon sx={{ fontSize: 18, mt: "2px" }} />
              <Typography variant="body2">{t("form.editHint")}</Typography>
            </Stack>
          ) : (
            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: "12px",
                px: 2,
                py: 1.25,
              }}>
              <FormControlLabel
                sx={{ m: 0, width: "100%", justifyContent: "space-between", gap: 2 }}
                labelPlacement="start"
                control={
                  <Switch
                    name="planned"
                    checked={formik.values.planned}
                    onChange={formik.handleChange}
                    disabled={formik.isSubmitting}
                    inputProps={{ "aria-describedby": "expense-planned-hint" }}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{t("form.planned")}</Typography>
                    <Typography
                      id="expense-planned-hint"
                      variant="body2"
                      color="text.secondary">
                      {t("form.plannedHint")}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddExpenseForm;
