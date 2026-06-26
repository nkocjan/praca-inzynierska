import { NKTextInput } from "../../../lib/Input/TextInput.tsx";
import { NKButton } from "../../../lib/button/Button.tsx";
import Grid from "@mui/material/Grid2";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { apiClient } from "../../../api/apiClient"; // Upewnij się, że ścieżka jest poprawna
import { useState } from "react";
import { AuthRequestDTO } from "../../../api/generated/api.ts";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("auth");

  const formik = useFormik<AuthRequestDTO>({
    initialValues: {
      username: "",
      password: "",
    },

    onSubmit: async values => {
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
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}>
        <Grid size={4}>
          <Grid
            container
            direction="column"
            spacing={2}
            alignItems="center">
            {/* --- Pole Login --- */}
            <Grid
              size={4}
              style={{ width: "100%" }}>
              <NKTextInput
                label={t("login.username")}
                required={true}
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            <Grid
              size={4}
              style={{ width: "100%" }}>
              <NKTextInput
                label={t("login.password")}
                required={true}
                type="password"
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

            <Grid
              container
              size={4}
              style={{ width: "100%" }}
              direction="row">
              <Grid size={4}>
                <NKButton
                  title={loading ? t("login.submitting") : t("login.submit")}
                  type="submit"
                  disabled={loading}
                />
              </Grid>
              <Grid size={4}>
                <NKButton
                  type="button"
                  title={t("login.forgotPassword")}
                  onClick={() => navigate("/forgot-password")}
                />
              </Grid>
              <Grid size={4}>
                <NKButton
                  type="button"
                  title={t("login.register")}
                  onClick={() => navigate("/register")}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Login;
