import { useState } from "react";
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useFormik } from "formik";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../api/apiClient";
import { AuthRequestDTO } from "../../../api/generated/api.ts";
import AuthLayout from "../../auth/AuthLayout.tsx";
import DemoAccountsPanel from "./DemoAccountsPanel.tsx";
import { isTooManyAttemptsError } from "../../../lib/errors/tooManyAttemptsError.ts";

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      enqueueSnackbar(
        isTooManyAttemptsError(error)
          ? t("login.tooManyAttempts")
          : t("login.invalidCredentials"),
        { variant: "error" },
      );
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
    <AuthLayout>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 1 }}>
        {t("login.heading")}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}>
        {t("login.subtitle")}
      </Typography>

      <form
        onSubmit={formik.handleSubmit}
        noValidate>
        <Stack spacing={2.5}>
          <TextField
            label={t("login.username")}
            name="username"
            autoComplete="username"
            required
            fullWidth
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label={t("login.password")}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                      onClick={() => setShowPassword(value => !value)}>
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}>
            {loading ? t("login.submitting") : t("login.submit")}
          </Button>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}>
            {t("login.noAccount")}{" "}
            <Link
              component={RouterLink}
              to="/register"
              fontWeight={600}>
              {t("login.registerLink")}
            </Link>
          </Typography>
        </Stack>
      </form>

      <Divider sx={{ my: 4, color: "text.secondary", fontSize: "0.85rem" }}>{t("demo.divider")}</Divider>

      <DemoAccountsPanel
        disabled={loading}
        onLogin={(username, password) => login({ username, password })}
      />
    </AuthLayout>
  );
};

export default Login;
