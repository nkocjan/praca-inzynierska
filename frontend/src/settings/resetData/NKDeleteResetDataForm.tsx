import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Musisz podać adres email")
    .required("Musisz podać adres email"),
  password: Yup.string().required("Musisz podać hasło"),
});

const NKDeleteResetDataForm = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Zmieniono dane", values);
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
      }}
    >
      <TextField
        sx={{ marginTop: "8px" }}
        label="Email"
        variant="outlined"
        fullWidth
        size="small"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.email && formik.errors.email}
          </span>
        }
      />
      <TextField
        sx={{ marginTop: "8px" }}
        label="Hasło"
        variant="outlined"
        type="password"
        fullWidth
        size="small"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.password && formik.errors.password}
          </span>
        }
      />
    </form>
  );
};

export default NKDeleteResetDataForm;
