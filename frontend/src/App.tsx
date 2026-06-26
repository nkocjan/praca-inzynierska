import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import Login from "./components/routes/login/login.tsx";
import NKRegister from "./components/routes/register/register.tsx";
import NKLayout from "./layout/NKLayout.tsx";
import NKSettings from "./settings/NKSettings.tsx";
import NKExpenses from "./components/routes/expenses/NKExpenses.tsx";
import NKBudget from "./components/routes/budget/NKBudget.tsx";
import NKCategories from "./components/routes/categories/NKCategories.tsx";
import NKInformation from "./components/routes/information/NKInformation.tsx";
import { DialogProvider } from "./lib/dialog/NKDialogContext.tsx";
import NKDashboard from "./components/routes/dashboard/NKDashboard.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import PublicRoute from "./components/auth/PublicRoute.tsx";
import i18n, { normalizeLanguage } from "./i18n/i18n";
import ColorModeProvider from "./theme/ColorModeProvider";
import { useColorMode } from "./theme/useColorMode";

const AppContent = () => {
  // Hook zapewnia re-render po zmianie języka
  useTranslation();
  const language = normalizeLanguage(i18n.language);

  const { mode } = useColorMode();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={language}>
        <SnackbarProvider /* ...propsy... */>
          <DialogProvider>
            <Router>
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route
                    path="/login"
                    element={<Login />}
                  />
                  <Route
                    path="/register"
                    element={<NKRegister />}
                  />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/"
                    element={<NKLayout />}>
                    <Route
                      path=""
                      element={<NKDashboard />}
                    />
                    <Route
                      path="settings"
                      element={<NKSettings />}
                    />
                    <Route
                      path="expenses"
                      element={<NKExpenses />}
                    />
                    <Route
                      path="budget"
                      element={<NKBudget />}
                    />
                    <Route
                      path="categories"
                      element={<NKCategories />}
                    />
                    <Route
                      path="information"
                      element={<NKInformation />}
                    />
                  </Route>
                </Route>
              </Routes>
            </Router>
          </DialogProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <ColorModeProvider>
      <AppContent />
    </ColorModeProvider>
  );
};

export default App;
