import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/routes/login/login.tsx";
import NKRegister from "./components/routes/register/register.tsx";
import NKLayout from "./layout/NKLayout.tsx";
import NKSettings from "./settings/NKSettings.tsx";
import NKExpenses from "./components/routes/expenses/NKExpenses.tsx";
import NKBudget from "./components/routes/budget/NKBudget.tsx";
import NKCategories from "./components/routes/categories/NKCategories.tsx";
import NKInformation from "./components/routes/information/NKInformation.tsx";
import { SnackbarProvider } from "notistack";
import { DialogProvider } from "./lib/dialog/NKDialogContext.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import NKDashboard from "./components/routes/dashboard/NKDashboard.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import PublicRoute from "./components/auth/PublicRoute.tsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider /* ...propsy... */>
          <DialogProvider>
            <Router>
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<NKRegister />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<NKLayout />}>
                    <Route path="" element={<NKDashboard />}></Route>
                    <Route path="settings" element={<NKSettings />}></Route>
                    <Route path="expenses" element={<NKExpenses />}></Route>
                    <Route path="budget" element={<NKBudget />}></Route>
                    <Route path="categories" element={<NKCategories />}></Route>
                    <Route
                      path="information"
                      element={<NKInformation />}
                    ></Route>
                  </Route>
                </Route>
              </Routes>
            </Router>
          </DialogProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
);
