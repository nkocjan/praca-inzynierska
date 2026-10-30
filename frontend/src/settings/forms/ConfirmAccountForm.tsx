import { Box, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { apiClient } from "../../api/apiClient";
import PasswordField from "../../lib/Input/PasswordField";
import { isDemoAccountError } from "../../lib/errors/demoAccountError";
import { isTooManyAttemptsError } from "../../lib/errors/tooManyAttemptsError";

export type AccountAction = "resetData" | "deleteAccount";

const ENDPOINTS: Record<AccountAction, string> = {
  resetData: "/api/bff/users/me/reset-data",
  deleteAccount: "/api/bff/users/me/delete",
};

interface ConfirmAccountFormProps {
  action: AccountAction;
  formId: string;
  onSuccess: () => void;
}

// Wiping the data or the whole account is confirmed with the account's e-mail and password.
const ConfirmAccountForm = ({ action, formId, onSuccess }: ConfirmAccountFormProps) => {
  const { t } = useTranslation("settings");
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().trim().email(t("credentials.validation.emailInvalid")).required(t("credentials.validation.emailRequired")),
      password: Yup.string().required(t("credentials.validation.passwordRequired")),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await apiClient.post(ENDPOINTS[action], { email: values.email.trim(), password: values.password });
        enqueueSnackbar(t(`${action}.done`), { variant: "success" });
        onSuccess();
      } catch (error) {
        console.error("Błąd operacji na koncie:", error);
        const message = isDemoAccountError(error)
          ? t("demoAccountBlocked")
          : isTooManyAttemptsError(error)
            ? t("tooManyAttempts")
            : t(`${action}.error`);
        enqueueSnackbar(message, { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fieldProps = (name: "email" | "password") => ({
    name,
    fullWidth: true,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: Boolean(formik.touched[name] && formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name] ? formik.errors[name] : undefined,
    disabled: formik.isSubmitting,
  });

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={formik.handleSubmit}
      noValidate>
      <Typography>{t(`${action}.dialogText`)}</Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1, mb: 2.5 }}>
        {t("confirm.hint")}
      </Typography>
      <Stack spacing={2}>
        <TextField
          {...fieldProps("email")}
          type="email"
          label={t("confirm.email")}
          autoComplete="email"
          autoFocus
        />
        <PasswordField
          {...fieldProps("password")}
          label={t("confirm.password")}
          autoComplete="current-password"
        />
      </Stack>
    </Box>
  );
};

export default ConfirmAccountForm;
