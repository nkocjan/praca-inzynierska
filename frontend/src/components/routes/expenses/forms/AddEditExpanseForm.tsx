import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";

import { useSnackbar } from "notistack";
import { apiClient } from "../../../../api/apiClient.ts";
import {
  CategoryUiDTO,
  CreateExpenseRequestUiDTO,
  UpdateExpenseRequestUiDTO,
} from "../../../../api/generated";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

  const tt = (key: string, options?: Record<string, unknown>) =>
    i18n.t(key, { ns: "expenses", ...options });

  const validationSchema = Yup.object({
    name: Yup.string().required(tt("validation.nameRequired")),
    category: Yup.string().required(tt("validation.categoryRequired")),
    amount: Yup.number()
      .min(0.01, tt("validation.amountMin"))
      .required(tt("validation.amountRequired")),
    date: Yup.mixed<Dayjs>().nullable().required(tt("validation.dateRequired")),
    planned: Yup.boolean().required(tt("validation.plannedRequired")),
    description: Yup.string().max(255, tt("validation.descriptionMax")),
  });

  const [categories, setCategories] = useState<CategoryUiDTO[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await apiClient.get<CategoryUiDTO[]>(
          "/api/bff/categories/combo",
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Nie udało się pobrać kategorii:", error);
        enqueueSnackbar(t("snackbar.categoriesFetchError"), {
          variant: "error",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    void fetchCategories();
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
            name: values.name,
            description: values.description,
            amount: Number(values.amount),
            date: localDateTimeString,
          };
          await apiClient.put(`/api/bff/expenses/${props.id}`, requestBody);
          enqueueSnackbar(t("snackbar.expenseUpdated"), {
            variant: "success",
          });
        } else {
          const requestBody: CreateExpenseRequestUiDTO = {
            name: values.name,
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
        enqueueSnackbar(t("snackbar.expenseSaveError"), {
          variant: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form
      id={props.formId}
      onSubmit={formik.handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxWidth: "450px",
      }}>
      <TextField
        sx={{ marginTop: "8px" }}
        label={t("form.name")}
        variant="outlined"
        fullWidth
        size="small"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.name && formik.errors.name}
          </span>
        }
        disabled={formik.isSubmitting}
      />

      <TextField
        label={t("form.descriptionOptional")}
        variant="outlined"
        fullWidth
        multiline
        rows={2}
        size="small"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.description && formik.errors.description}
          </span>
        }
        disabled={formik.isSubmitting}
      />

      <FormControl
        sx={{ width: "100%" }}
        size="small"
        error={formik.touched.category && Boolean(formik.errors.category)}
        disabled={props.isEdit || formik.isSubmitting || loadingCategories}>
        <InputLabel>{t("form.category")}</InputLabel>
        <Select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          input={<OutlinedInput label={t("form.category")} />}>
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
              value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText sx={{ minHeight: "20px" }}>
          {formik.touched.category && formik.errors.category}
        </FormHelperText>
      </FormControl>

      <TextField
        label={t("form.amount")}
        type="number"
        variant="outlined"
        fullWidth
        size="small"
        name="amount"
        value={formik.values.amount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.amount && formik.errors.amount}
          </span>
        }
        disabled={formik.isSubmitting}
      />

      <DatePicker
        label={t("form.date")}
        value={formik.values.date}
        onChange={(date: Dayjs | null) =>
          formik.setFieldValue("date", date ? dayjs(date) : null)
        }
        disabled={formik.isSubmitting}
        slotProps={{
          textField: {
            variant: "outlined",
            size: "small",
            fullWidth: true,
            error: formik.touched.date && Boolean(formik.errors.date),
            helperText:
              (formik.touched.date && String(formik.errors.date || "")) || " ",
            sx: {
              "& .MuiFormHelperText-root": {
                minHeight: "20px",
              },
            },
          },
        }}
      />

      <FormControl
        sx={{ marginTop: "8px" }}
        component="fieldset"
        error={formik.touched.planned && Boolean(formik.errors.planned)}
        disabled={props.isEdit || formik.isSubmitting}>
        <FormLabel component="legend">{t("form.plannedQuestion")}</FormLabel>
        <RadioGroup
          row
          name="planned"
          value={formik.values.planned}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}>
          <FormControlLabel
            value={true}
            control={<Radio />}
            label={t("form.yes")}
          />
          <FormControlLabel
            value={false}
            control={<Radio />}
            label={t("form.no")}
          />
        </RadioGroup>
        {formik.touched.planned && formik.errors.planned && (
          <FormHelperText sx={{ minHeight: "20px" }}>
            {formik.errors.planned}
          </FormHelperText>
        )}
      </FormControl>
    </form>
  );
};

export default AddExpenseForm;
