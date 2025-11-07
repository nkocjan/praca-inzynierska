import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiClient } from "../../../../api/apiClient.ts";
import { enqueueSnackbar } from "notistack";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Nazwa jest wymagana")
    .min(2, "Nazwa jest za krótka"),
  weekBudget: Yup.number()
    .min(0, "Wartość musi być większa od 0")
    .positive("Wartość musi być większa od 0")
    .required("Podanie budżetu jest wymagane"),
  monthBudget: Yup.number()
    .min(0, "Wartość musi być większa od 0")
    .positive("Wartość musi być większa od 0")
    .required("Podanie budżetu jest wymagane"),
  yearBudget: Yup.number()
    .min(0, "Wartość musi być większa od 0")
    .positive("Wartość musi być większa od 0")
    .required("Podanie budżetu jest wymagane"),
});

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
            throw new Error("Brak ID wydatku podczas próby edycji.");
          }

          await apiClient.put(`/api/bff/categories/${props.id}`, requestBody);
          enqueueSnackbar("Kategoria zaktualizowana pomyślnie", {
            variant: "success",
          });
        } else {
          await apiClient.post("/api/bff/categories", requestBody);
          enqueueSnackbar("Kategoria utworzona pomyślnie", {
            variant: "success",
          });
        }

        props.onSuccess();
      } catch (error) {
        console.error("Błąd podczas zapisywania kategorii:", error);
        enqueueSnackbar("Wystąpił błąd. Spróbuj ponownie.", {
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
      }}
    >
      <TextField
        sx={{ marginTop: "8px" }}
        label="Nazwa"
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
        label="Budżet tygodniowy"
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
        label="Budżet miesięczny"
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
        label="Budżet tygodniowy"
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
