import { alpha, createTheme, Theme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type { ThemeMode } from "./colorModeContext";

const tokens = {
  light: {
    background: { default: "#f4f6fb", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#475569" },
    divider: "#e2e8f0",
    primary: { main: "#4f46e5", light: "#6366f1", dark: "#4338ca", contrastText: "#ffffff" },
    success: { main: "#15803d" },
    warning: { main: "#d97706" },
    error: { main: "#dc2626" },
    info: { main: "#0369a1" },
    shadow: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
  },
  dark: {
    background: { default: "#0b1020", paper: "#141b2d" },
    text: { primary: "#e5e7eb", secondary: "#9ca3af" },
    divider: "rgba(148, 163, 184, 0.16)",
    primary: { main: "#818cf8", light: "#a5b4fc", dark: "#6366f1", contrastText: "#0b1020" },
    success: { main: "#4ade80" },
    warning: { main: "#fbbf24" },
    error: { main: "#f87171" },
    info: { main: "#38bdf8" },
    shadow: "0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.25)",
  },
};

export const createAppTheme = (mode: ThemeMode): Theme => {
  const t = tokens[mode];

  return createTheme({
    palette: {
      mode,
      background: t.background,
      text: t.text,
      divider: t.divider,
      primary: t.primary,
      success: t.success,
      warning: t.warning,
      error: t.error,
      info: t.info,
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter Variable", Inter, system-ui, -apple-system, "Segoe UI", sans-serif',
      h1: { fontWeight: 700, letterSpacing: "-0.02em" },
      h2: { fontWeight: 700, letterSpacing: "-0.02em" },
      h3: { fontWeight: 700, letterSpacing: "-0.02em" },
      h4: { fontWeight: 700, letterSpacing: "-0.015em" },
      h5: { fontWeight: 650, letterSpacing: "-0.01em" },
      h6: { fontWeight: 650 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: "none" },
      overline: { fontWeight: 600, letterSpacing: "0.08em" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: t.background.default },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundImage: "none" },
          outlined: { borderColor: t.divider },
        },
      },
      MuiCard: {
        defaultProps: { variant: "outlined" },
        styleOverrides: {
          root: { borderRadius: 16, boxShadow: t.shadow },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 10, paddingInline: 16 },
          sizeLarge: { paddingBlock: 10, fontSize: "0.95rem" },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 10, backgroundColor: t.background.paper },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: "inherit" },
        styleOverrides: {
          root: {
            backgroundColor: alpha(t.background.default, 0.8),
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${t.divider}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRight: `1px solid ${t.divider}`, backgroundColor: t.background.paper },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { height: 8, borderRadius: 4, backgroundColor: alpha(t.text.secondary, 0.15) },
          bar: { borderRadius: 4 },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 16, backgroundImage: "none" } },
      },
      MuiToggleButton: {
        styleOverrides: { root: { textTransform: "none", fontWeight: 600 } },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: { borderColor: t.divider, backgroundColor: t.background.paper },
        },
      },
    },
  });
};
