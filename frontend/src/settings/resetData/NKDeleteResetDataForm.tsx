import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiClient } from "../../api/apiClient";
import { useSnackbar } from "notistack";
import { useDialog } from "../../lib/dialog/useDialog";
import { useTranslation } from "react-i18next";

type Mode = "reset-data" | "delete-account";

interface Props {
  formId?: string;
  mode?: Mode;
  onSuccess?: () => void;
}

const NKDeleteResetDataForm = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { closeDialog } = useDialog();
  const { t } = useTranslation("settings");

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("deleteResetForm.validation.emailInvalid"))
      .required(t("deleteResetForm.validation.emailRequired")),
    password: Yup.string().required(
      t("deleteResetForm.validation.passwordRequired"),
    ),
  });

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
          enqueueSnackbar(t("deleteResetForm.snackbar.resetSuccess"), {
            variant: "success",
          });
        } else if (props.mode === "delete-account") {
          await apiClient.post("/api/bff/users/me/delete", values);
          enqueueSnackbar(t("deleteResetForm.snackbar.deleteSuccess"), {
            variant: "success",
          });
        } else {
          enqueueSnackbar(t("deleteResetForm.snackbar.missingAction"), {
            variant: "warning",
          });
          return;
        }

        resetForm();
        closeDialog();
        props.onSuccess?.();
      } catch (error) {
        console.error("Błąd operacji ustawień:", error);
        enqueueSnackbar(t("deleteResetForm.snackbar.failed"), {
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
        label={t("deleteResetForm.fields.email")}
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
        label={t("deleteResetForm.fields.password")}
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
