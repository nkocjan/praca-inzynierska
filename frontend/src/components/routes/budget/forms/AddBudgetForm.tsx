import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { apiClient } from "../../../../api/apiClient";
import type {
  BudgetCreateRequestUiDTO,
  CategoryUiDTO,
} from "../../../../api/generated";

interface Props {
  formId: string;
  onSuccess: () => void;
}

const AddBudgetForm = ({ formId, onSuccess }: Props) => {
  const { t, i18n } = useTranslation("budgets");
  const { enqueueSnackbar } = useSnackbar();

  const tt = (key: string, options?: Record<string, unknown>) =>
    i18n.t(key, { ns: "budgets", ...options });

  const validationSchema = Yup.object({
    name: Yup.string().required(tt("validation.nameRequired")),
    categoryId: Yup.string().required(tt("validation.categoryRequired")),
    description: Yup.string().max(255, tt("validation.descriptionMax")),
  });

  const [categories, setCategories] = useState<CategoryUiDTO[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await apiClient.get<CategoryUiDTO[]>(
          "/api/bff/categories/combo",
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
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
      name: "",
      description: "",
      categoryId: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload: BudgetCreateRequestUiDTO = {
          name: values.name,
          description: values.description || undefined,
          categoryId: values.categoryId,
          isActive: true,
        };

        await apiClient.post("/api/bff/budgets", payload);
        enqueueSnackbar(t("snackbar.budgetCreated"), { variant: "success" });
        onSuccess();
      } catch (error) {
        console.error("Błąd podczas tworzenia budżetu:", error);
        enqueueSnackbar(t("snackbar.budgetCreateError"), { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form
      id={formId}
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
        error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
        disabled={formik.isSubmitting || loadingCategories}>
        <InputLabel>{t("form.category")}</InputLabel>
        <Select
          name="categoryId"
          value={formik.values.categoryId}
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
          {!loadingCategories && (
            <MenuItem value="">
              <em>{t("form.chooseCategory")}</em>
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
          {formik.touched.categoryId && formik.errors.categoryId}
        </FormHelperText>
      </FormControl>
    </form>
  );
};

export default AddBudgetForm;
