import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Nazwa jest wymagana"),
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

const AddCategoryForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      weekBudget: null,
      monthBudget: null,
      yearBudget: null,
    },
    validationSchema,
    onSubmit: values => {
      console.log("Stworzono kategorię", values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxWidth: "450px",
      }}>
      <TextField
        sx={{ marginTop: "8px" }}
        label="Nazwa"
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
