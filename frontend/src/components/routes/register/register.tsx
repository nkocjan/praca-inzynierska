import { useMemo, useState } from "react";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../api/apiClient.ts";
import { UserCreateRequestDTO } from "../../../api/generated/api.ts";
import AuthLayout from "../../auth/AuthLayout.tsx";

type RegisterValues = {
  name: string;
  surname: string;
  username: string;
  phoneNumber: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
};

const FIELDS: { name: keyof RegisterValues; type?: string; autoComplete: string }[] = [
  { name: "name", autoComplete: "given-name" },
  { name: "surname", autoComplete: "family-name" },
  { name: "username", autoComplete: "username" },
  { name: "phoneNumber", type: "tel", autoComplete: "tel" },
  { name: "email", type: "email", autoComplete: "email" },
  { name: "confirmEmail", type: "email", autoComplete: "email" },
  { name: "password", type: "password", autoComplete: "new-password" },
  { name: "confirmPassword", type: "password", autoComplete: "new-password" },
];

const NKRegister = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation(["auth", "validation"]);

  const validationSchema = useMemo(() => {
    return yup.object({
      name: yup.string().required(t("validation:nameRequired")),
      surname: yup.string().required(t("validation:surnameRequired")),
      username: yup
        .string()
        .min(3, t("validation:usernameMin", { min: 3 }))
        .required(t("validation:usernameRequired")),
      password: yup
        .string()
        .min(8, t("validation:passwordMin", { min: 8 }))
        .matches(/[A-Z]/, t("validation:passwordUppercase"))
        .matches(/[0-9]/, t("validation:passwordNumber"))
        .required(t("validation:passwordRequired")),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], t("validation:confirmPasswordMatch"))
        .required(t("validation:confirmPasswordRequired")),
      email: yup
        .string()
        .email(t("validation:emailInvalid"))
        .required(t("validation:emailRequired")),
      confirmEmail: yup
        .string()
        .oneOf([yup.ref("email")], t("validation:confirmEmailMatch"))
        .required(t("validation:confirmEmailRequired")),
      phoneNumber: yup.string().required(t("validation:phoneRequired")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const formik = useFormik<RegisterValues>({
    initialValues: {
      name: "",
      surname: "",
      username: "",
      phoneNumber: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true);
      try {
        const request: UserCreateRequestDTO = {
          name: values.name,
          surname: values.surname,
          password: values.password,
          username: values.username,
          email: values.email,
          phoneNumber: values.phoneNumber,
        };

        await apiClient.post("/api/bff/users", request);

        enqueueSnackbar(t("auth:register.success"), {
          variant: "success",
        });

        navigate("/login");
      } catch (error) {
        console.error("Błąd rejestracji:", error);
        enqueueSnackbar(t("auth:register.error"), {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const helperFor = (name: keyof RegisterValues) => {
    if (formik.touched[name] && formik.errors[name]) return formik.errors[name];
    if (name === "password") return t("auth:register.passwordHint");
    return " ";
  };

  return (
    <AuthLayout contentWidth={560}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 1 }}>
        {t("auth:register.heading")}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}>
        {t("auth:register.subtitle")}
      </Typography>

      <form
        onSubmit={formik.handleSubmit}
        noValidate>
        <Grid
          container
          columnSpacing={2}
          rowSpacing={0.5}>
          {FIELDS.map(field => (
            <Grid
              key={field.name}
              size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t(`auth:register.${field.name}`)}
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                required
                fullWidth
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                helperText={helperFor(field.name)}
              />
            </Grid>
          ))}
        </Grid>

        <Stack
          spacing={2}
          sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}>
            {loading ? t("auth:register.submitting") : t("auth:register.submit")}
          </Button>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}>
            {t("auth:register.haveAccount")}{" "}
            <Link
              component={RouterLink}
              to="/login"
              fontWeight={600}>
              {t("auth:register.loginLink")}
            </Link>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}>
            {t("auth:register.tryDemo")}{" "}
            <Link
              component={RouterLink}
              to="/login"
              fontWeight={600}>
              {t("auth:register.tryDemoLink")}
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default NKRegister;
