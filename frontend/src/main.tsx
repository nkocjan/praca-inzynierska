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

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<NKRegister />} />

                    <Route path="/" element={<NKLayout />}>
                        <Route path="settings" element={<NKSettings />} ></Route>
                        <Route path="expenses" element={<NKExpenses />} ></Route>
                        <Route path="budget" element={<NKBudget />} ></Route>
                        <Route path="categories" element={<NKCategories />} ></Route>
                        <Route path="information" element={<NKInformation />} ></Route>
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    </StrictMode>
);
