import { NKTextInput } from "../../../lib/Input/TextInput.tsx";
import { NKButton } from "../../../lib/button/Button.tsx";
import Grid from "@mui/material/Grid2";
import { Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { apiClient } from "../../../api/apiClient"; // Upewnij się, że ścieżka jest poprawna
import { useState } from "react";
import { AuthRequestDTO } from "../../../api/generated/api.ts";
import { useTranslation } from "react-i18next";
import DemoAccountsPanel from "./DemoAccountsPanel.tsx";

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("auth");

  const login = async (values: AuthRequestDTO) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/login", values);

      const token = response.data.token;

      if (!token) {
        throw new Error(t("login.noToken"));
      }

      localStorage.setItem("jwtToken", token);

      enqueueSnackbar(t("login.success"), { variant: "success" });

      navigate("/");
    } catch (error) {
      console.error("Błąd logowania:", error);
      enqueueSnackbar(t("login.invalidCredentials"), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik<AuthRequestDTO>({
    initialValues: {
      username: "",
      password: "",
    },

    onSubmit: login,
  });

  return (
    <Grid
      container
      component="main"
      spacing={4}
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", p: 2 }}>
      <Grid size={{ xs: 12, sm: 8, md: 5, lg: 4 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Typography
              variant="h4"
              component="h1">
              {t("login.title")}
            </Typography>

            <NKTextInput
              label={t("login.username")}
              required={true}
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <NKTextInput
              label={t("login.password")}
              required={true}
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <Stack
              direction="row"
              spacing={2}>
              <NKButton
                title={loading ? t("login.submitting") : t("login.submit")}
                type="submit"
                disabled={loading}
              />
              <NKButton
                type="button"
                title={t("login.register")}
                onClick={() => navigate("/register")}
              />
            </Stack>
          </Stack>
        </form>
      </Grid>

      {/* On narrow screens the demo accounts come first: that is what most visitors want. */}
      <Grid
        size={{ xs: 12, sm: 8, md: 6, lg: 5 }}
        sx={{ order: { xs: -1, md: 0 } }}>
        <DemoAccountsPanel
          disabled={loading}
          onLogin={(username, password) => login({ username, password })}
        />
      </Grid>
    </Grid>
  );
};

export default Login;
