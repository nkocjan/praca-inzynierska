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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// Schemat walidacji Yup pasujący do DTO i tooltipów
const validationSchema = yup.object({
  name: yup.string().required("Imię jest wymagane"),
  surname: yup.string().required("Nazwisko jest wymagane"),
  username: yup
    .string()
    .min(3, "Login musi zawierać minimum 3 znaki")
    .required("Login jest wymagany"),
  password: yup
    .string()
    .min(8, "Hasło musi zawierać minimum 8 znaków")
    .matches(/[A-Z]/, "Musi zawierać co najmniej jedną dużą literę")
    .matches(/[0-9]/, "Musi zawierać co najmniej jedną cyfrę")
    .required("Hasło jest wymagane"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Hasła muszą być identyczne")
    .required("Proszę powtórzyć hasło"),
  email: yup
    .string()
    .email("Niepoprawny format email")
    .required("Email jest wymagany"),
  confirmEmail: yup
    .string()
    .oneOf([yup.ref("email")], "Adresy email muszą być identyczne")
    .required("Proszę powtórzyć email"),
  phoneNumber: yup.string().required("Numer telefonu jest wymagany"),
});

const NKRegister = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

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
    validationSchema: validationSchema,
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

        enqueueSnackbar(
          "Konto utworzone pomyślnie! Możesz się teraz zalogować.",
          {
            variant: "success",
          }
        );

        // 3. Przekieruj na stronę logowania
        navigate("/login");
      } catch (error) {
        console.error("Błąd rejestracji:", error);
        enqueueSnackbar("Wystąpił błąd podczas rejestracji.", {
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
              Utwórz nowe konto
            </Typography>

            {/* --- IMIĘ --- */}
            <Grid
              size={5}
              sx={{ mb: 2.5 }}>
              {" "}
              {/* Dodano margines dolny */}
              <NKTextInput
                label="Imię"
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
                label="Nazwisko"
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
                label="Login"
                required={true}
                tooltip="Login musi zawierać minimum 3 znaki"
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
                label="Hasło"
                type="password"
                required={true}
                tooltip="Hasło musi zawierać minimum 8 znaków, jedną cyfrę i jedną dużą literę"
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
                label="Powtórz hasło"
                type="password"
                required={true}
                tooltip="Hasła muszą być identyczne"
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
                label="Email"
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
                label="Powtórz email"
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
                label="Numer telefonu"
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
                  title={loading ? "Rejestrowanie..." : "Zarejestruj się"}
                  type="submit"
                  disabled={loading}
                />
              </Grid>
              <Grid size={6}>
                <NKButton
                  title="Powrót do logowania"
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
