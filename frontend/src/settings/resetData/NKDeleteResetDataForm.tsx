import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiClient } from "../../api/apiClient";
import { useSnackbar } from "notistack";
import { useDialog } from "../../lib/dialog/NKDialogContext";

type Mode = "reset-data" | "delete-account";

interface Props {
  formId?: string;
  mode?: Mode;
  onSuccess?: () => void;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Musisz podać adres email")
    .required("Musisz podać adres email"),
  password: Yup.string().required("Musisz podać hasło"),
});

const NKDeleteResetDataForm = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { closeDialog } = useDialog();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (props.mode === "reset-data") {
          await apiClient.post("/api/bff/users/me/reset-data", values);
          enqueueSnackbar("Dane zostały zresetowane", { variant: "success" });
        } else if (props.mode === "delete-account") {
          await apiClient.post("/api/bff/users/me/delete", values);
          enqueueSnackbar("Konto zostało usunięte", { variant: "success" });
        } else {
          enqueueSnackbar("Brak akcji dla formularza", { variant: "warning" });
          return;
        }

        resetForm();
        closeDialog();
        props.onSuccess?.();
      } catch (error) {
        console.error("Błąd operacji ustawień:", error);
        enqueueSnackbar("Operacja nie powiodła się", { variant: "error" });
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
        label="Email"
        variant="outlined"
        fullWidth
        size="small"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={formik.isSubmitting}
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
        disabled={formik.isSubmitting}
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
