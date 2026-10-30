import { Box, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { apiClient } from "../../api/apiClient";
import { refreshCurrentUser } from "../../auth/useCurrentUser";
import PasswordField from "../../lib/Input/PasswordField";
import { isDemoAccountError } from "../../lib/errors/demoAccountError";

export type CredentialKind = "login" | "password" | "email";

interface CredentialFormProps {
  kind: CredentialKind;
  formId: string;
  onSuccess: () => void;
}

type Values = { value: string; repeat: string; password: string };

// One dialog form for the three sign-in details: the new value, its repetition where it is easy to mistype,
// and the current password.
const CredentialForm = ({ kind, formId, onSuccess }: CredentialFormProps) => {
  const { t } = useTranslation(["settings", "validation"]);
  const { enqueueSnackbar } = useSnackbar();

  const newPassword = Yup.string()
    .min(8, t("validation:passwordMin", { min: 8 }))
    .matches(/[A-Z]/, t("validation:passwordUppercase"))
    .matches(/[0-9]/, t("validation:passwordNumber"))
    .required(t("settings:credentials.validation.newPasswordRequired"));
  const currentPassword = Yup.string().required(t("settings:credentials.validation.passwordRequired"));

  const schemas = {
    login: Yup.object({
      value: Yup.string().trim().min(3, t("settings:credentials.validation.loginMin")).required(t("settings:credentials.validation.loginRequired")),
      password: currentPassword,
    }),
    password: Yup.object({
      password: currentPassword,
      value: newPassword,
      repeat: Yup.string()
        .oneOf([Yup.ref("value")], t("settings:credentials.validation.passwordsMustMatch"))
        .required(t("settings:credentials.validation.repeatRequired")),
    }),
    email: Yup.object({
      value: Yup.string().trim().email(t("settings:credentials.validation.emailInvalid")).required(t("settings:credentials.validation.emailRequired")),
      repeat: Yup.string()
        .trim()
        .oneOf([Yup.ref("value")], t("settings:credentials.validation.emailsMustMatch"))
        .required(t("settings:credentials.validation.repeatRequired")),
      password: currentPassword,
    }),
  };

  const send = (values: Values) => {
    switch (kind) {
      case "login":
        return apiClient.put("/api/bff/users/me/nickname", {
          newNickname: values.value.trim(),
          password: values.password,
          confirmPassword: values.password,
        });
      case "password":
        return apiClient.put("/api/bff/users/me/password", {
          oldPassword: values.password,
          newPassword: values.value,
          confirmNewPassword: values.repeat,
        });
      case "email":
        return apiClient.put("/api/bff/users/me/email", {
          newEmail: values.value.trim(),
          confirmNewEmail: values.repeat.trim(),
          password: values.password,
        });
    }
  };

  const formik = useFormik<Values>({
    initialValues: { value: "", repeat: "", password: "" },
    validationSchema: schemas[kind],
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await send(values);
        enqueueSnackbar(t(`settings:credentials.${kind}.saved`), { variant: "success" });
        refreshCurrentUser();
        onSuccess();
      } catch (error) {
        console.error("Błąd zapisu danych logowania:", error);
        enqueueSnackbar(isDemoAccountError(error) ? t("settings:demoAccountBlocked") : t("settings:credentials.saveError"), {
          variant: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fieldProps = (name: keyof Values) => ({
    name,
    fullWidth: true,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: Boolean(formik.touched[name] && formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name] ? formik.errors[name] : undefined,
    disabled: formik.isSubmitting,
  });

  const currentPasswordField = (
    <PasswordField
      {...fieldProps("password")}
      label={t("settings:credentials.currentPassword")}
      autoComplete="current-password"
      autoFocus={kind === "password"}
    />
  );

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ pt: 1 }}>
      <Stack spacing={2}>
        {kind === "login" && (
          <>
            <TextField
              {...fieldProps("value")}
              label={t("settings:credentials.login.new")}
              autoComplete="username"
              autoFocus
            />
            {currentPasswordField}
          </>
        )}
        {kind === "password" && (
          <>
            {currentPasswordField}
            <PasswordField
              {...fieldProps("value")}
              label={t("settings:credentials.password.new")}
              autoComplete="new-password"
              helperText={(formik.touched.value && formik.errors.value) || t("settings:credentials.password.hint")}
            />
            <PasswordField
              {...fieldProps("repeat")}
              label={t("settings:credentials.password.repeat")}
              autoComplete="new-password"
            />
          </>
        )}
        {kind === "email" && (
          <>
            <TextField
              {...fieldProps("value")}
              type="email"
              label={t("settings:credentials.email.new")}
              autoComplete="email"
              autoFocus
            />
            <TextField
              {...fieldProps("repeat")}
              type="email"
              label={t("settings:credentials.email.repeat")}
              autoComplete="email"
            />
            {currentPasswordField}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default CredentialForm;
