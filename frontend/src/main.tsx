import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login/login.tsx";
import NKRegister from "./register/register.tsx";
import NKLayout from "./layout/NKLayout.tsx";
import NKSettings from "./settings/NKSettings.tsx";

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
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    </StrictMode>
);
