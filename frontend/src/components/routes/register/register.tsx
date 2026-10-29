import { NKTextInput } from "../../../lib/Input/TextInput.tsx";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { NKButton } from "../../../lib/button/Button.tsx";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { apiClient } from "../../../api/apiClient.ts";
import { useState } from "react";
import { UserCreateRequestDTO } from "../../../api/generated/api.ts";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

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

  const formik = useFormik({
    // Typy dla initialValues (w tym pola potwierdzające)
    initialValues: {
      name: "",
      surname: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      confirmEmail: "",
      phoneNumber: "",
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true);
      try {
        // 1. Stwórz obiekt DTO tylko z tymi polami, które wysyłasz do API
        const request: UserCreateRequestDTO = {
          name: values.name,
          surname: values.surname,
          password: values.password,
          username: values.username,
          email: values.email,
          phoneNumber: values.phoneNumber,
        };

        // 2. Wywołaj publiczny endpoint rejestracji
        await apiClient.post("/api/bff/users", request);

        enqueueSnackbar(t("auth:register.success"), {
          variant: "success",
        });

        // 3. Przekieruj na stronę logowania
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* Użyj <form> aby Formik mógł przechwycić submit */}
      <form onSubmit={formik.handleSubmit}>
        <Grid
          container
          spacing={2}
          /* Zmieniono spacing na 2 dla ciaśniejszego układu */ size={12}>
          <Grid
            container
            size={12}
            direction="column"
            sx={{
              alignItems: "center",
              minWidth: "100vh",
              marginTop: "2rem",
            }}>
            <Typography
              variant="h4"
              gutterBottom>
              {t("auth:register.title")}
            </Typography>

            {/* --- IMIĘ --- */}
            <Grid
              size={5}
              sx={{ mb: 2.5 }}>
              {" "}
              {/* Dodano margines dolny */}
              <NKTextInput
                label={t("auth:register.name")}
                required={true}
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            {/* --- NAZWISKO --- */}
            <Grid
              size={5}
              sx={{ mb: 2.5 }}>
              <NKTextInput
                label={t("auth:register.surname")}
                required={true}
                name="surname"
                value={formik.values.surname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.surname && Boolean(formik.errors.surname)}
                helperText={formik.touched.surname && formik.errors.surname}
              />
            </Grid>

            {/* --- LOGIN --- */}
            <Grid
              size={5}
              sx={{ mb: 2.5 }}>
              <NKTextInput
                label={t("auth:register.username")}
                required={true}
                tooltip={t("auth:register.tooltip.username")}
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>

            {/* --- HASŁO --- */}
            <Grid
              size={5}
              sx={{ mb: 2.5 }}>
              <NKTextInput
                label={t("auth:register.password")}
                type="password"
                required={true}
                tooltip={t("auth:register.tooltip.password")}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>

            {/* --- POWTÓRZ HASŁO --- */}
            <Grid
              size={5}
              sx={{ mb: 2.5 }}>
              <NKTextInput
                label={t("auth:register.confirmPassword")}
                type="password"
                required={true}
                tooltip={t("auth:register.tooltip.confirmPassword")}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              />
            </Grid>

            {/* --- EMAIL --- */}
            <Grid
              size={5}
              sx={{ mb: 2.5 }}>
              <NKTextInput
                label={t("auth:register.email")}
                type="email"
                required={true}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            {/* --- POWTÓRZ EMAIL --- */}
            <Grid
              size={5}
              sx={{ mb: 2.5 }}>
              <NKTextInput
                label={t("auth:register.confirmEmail")}
                type="email"
                required={true}
                name="confirmEmail"
                value={formik.values.confirmEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmEmail &&
                  Boolean(formik.errors.confirmEmail)
                }
                helperText={
                  formik.touched.confirmEmail && formik.errors.confirmEmail
                }
              />
            </Grid>

            {/* --- NUMER TELEFONU --- */}
            <Grid
              size={5}
              sx={{ mb: 2.5 }}>
              <NKTextInput
                label={t("auth:register.phoneNumber")}
                required={true}
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
              />
            </Grid>

            {/* --- PRZYCISKI --- */}
            <Grid
              size={5}
              container
              direction="row"
              spacing={2}
              sx={{ mt: 2 }}>
              <Grid size={6}>
                <NKButton
                  title={
                    loading
                      ? t("auth:register.submitting")
                      : t("auth:register.submit")
                  }
                  type="submit"
                  disabled={loading}
                />
              </Grid>
              <Grid size={6}>
                <NKButton
                  title={t("auth:register.backToLogin")}
                  onClick={() => navigate("/login")}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </ThemeProvider>
  );
};

export default NKRegister;
