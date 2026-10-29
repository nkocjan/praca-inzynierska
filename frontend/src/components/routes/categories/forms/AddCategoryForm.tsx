import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiClient } from "../../../../api/apiClient.ts";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

interface properties {
  isEdit?: boolean;
  id?: string;
  name?: string;
  weeklyBudget?: number | null;
  monthlyBudget?: number | null;
  yearlyBudget?: number | null;
  onSuccess: () => void;
  formId?: string;
}

const AddCategoryForm = (props: properties) => {
  const { i18n, t } = useTranslation("categories");
  const tt = (key: string, options?: Record<string, unknown>) =>
    i18n.t(key, { ns: "categories", ...options });

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(tt("validation.nameRequired"))
      .min(2, tt("validation.nameMin")),
    weekBudget: Yup.number()
      .min(0, tt("validation.valueMin"))
      .positive(tt("validation.valueMin"))
      .required(tt("validation.budgetRequired")),
    monthBudget: Yup.number()
      .min(0, tt("validation.valueMin"))
      .positive(tt("validation.valueMin"))
      .required(tt("validation.budgetRequired")),
    yearBudget: Yup.number()
      .min(0, tt("validation.valueMin"))
      .positive(tt("validation.valueMin"))
      .required(tt("validation.budgetRequired")),
  });

  const formik = useFormik({
    initialValues: {
      id: props.id || null,
      name: props.name || "",
      weekBudget: props.weeklyBudget || null,
      monthBudget: props.monthlyBudget || null,
      yearBudget: props.yearlyBudget || null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const requestBody = {
        name: values.name,
        weekBudget: values.weekBudget,
        monthBudget: values.monthBudget,
        yearBudget: values.yearBudget,
      };

      try {
        if (props.isEdit) {
          if (!props.id) {
            throw new Error("Brak ID kategorii podczas próby edycji.");
          }

          await apiClient.put(`/api/bff/categories/${props.id}`, requestBody);
          enqueueSnackbar(t("snackbar.categoryUpdated"), {
            variant: "success",
          });
        } else {
          await apiClient.post("/api/bff/categories", requestBody);
          enqueueSnackbar(t("snackbar.categoryCreated"), {
            variant: "success",
          });
        }

        props.onSuccess();
      } catch (error) {
        console.error("Błąd podczas zapisywania kategorii:", error);
        enqueueSnackbar(t("snackbar.categorySaveError"), {
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
        disabled={props.isEdit}
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
      />

      <TextField
        sx={{ marginTop: "8px" }}
        label={t("form.weeklyBudget")}
        variant="outlined"
        fullWidth
        size="small"
        name="weekBudget"
        value={formik.values.weekBudget}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.weekBudget && Boolean(formik.errors.weekBudget)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.weekBudget && formik.errors.weekBudget}
          </span>
        }
      />

      <TextField
        sx={{ marginTop: "8px" }}
        label={t("form.monthlyBudget")}
        variant="outlined"
        fullWidth
        size="small"
        name="monthBudget"
        value={formik.values.monthBudget}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.monthBudget && Boolean(formik.errors.monthBudget)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.monthBudget && formik.errors.monthBudget}
          </span>
        }
      />

      <TextField
        sx={{ marginTop: "8px" }}
        label={t("form.yearlyBudget")}
        variant="outlined"
        fullWidth
        size="small"
        name="yearBudget"
        value={formik.values.yearBudget}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.yearBudget && Boolean(formik.errors.yearBudget)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.yearBudget && formik.errors.yearBudget}
          </span>
        }
      />
    </form>
  );
};

export default AddCategoryForm;
