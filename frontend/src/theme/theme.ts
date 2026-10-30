import { alpha, createTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { enUS as coreEnUS, plPL as corePlPL } from "@mui/material/locale";
import { enUS as gridEnUS, plPL as gridPlPL } from "@mui/x-data-grid/locales";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { enUS as pickersEnUS, plPL as pickersPlPL } from "@mui/x-date-pickers/locales";
import type { AppLanguage } from "../i18n/i18n";
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
    gridHeader: "#f8fafc",
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
    gridHeader: "#182036",
    shadow: "0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.25)",
  },
};

const locales = {
  pl: { core: corePlPL, grid: gridPlPL, pickers: pickersPlPL, of: "z" },
  en: { core: coreEnUS, grid: gridEnUS, pickers: pickersEnUS, of: "of" },
};

export const createAppTheme = (mode: ThemeMode, language: AppLanguage): Theme => {
  const t = tokens[mode];
  const locale = locales[language];
  // "1-10 z 120" with a plain hyphen instead of the library's en dash.
  const labelDisplayedRows = ({ from, to, count }: { from: number; to: number; count: number }) =>
    `${from}-${to} ${locale.of} ${count !== -1 ? count : `${to}+`}`;

  const options: ThemeOptions = {
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
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            "&.Mui-selected, &.Mui-selected:hover": {
              color: t.primary.main,
              backgroundColor: alpha(t.primary.main, mode === "light" ? 0.1 : 0.16),
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderColor: t.divider,
            backgroundColor: t.background.paper,
            "--DataGrid-rowBorderColor": t.divider,
            "--DataGrid-containerBackground": t.gridHeader,
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600, fontSize: "0.8125rem", color: t.text.secondary },
            "& .MuiDataGrid-columnSeparator": { display: "none" },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": { outline: "none" },
            "& .MuiDataGrid-cell:focus-visible, & .MuiDataGrid-columnHeader:focus-visible": {
              outline: `2px solid ${t.primary.main}`,
              outlineOffset: -2,
            },
          },
          row: {
            "&:hover": { backgroundColor: alpha(t.primary.main, 0.04) },
          },
        },
      },
    },
  };

  return createTheme(options, locale.core, locale.grid, locale.pickers, {
    components: {
      MuiDataGrid: { defaultProps: { localeText: { MuiTablePagination: { labelDisplayedRows } } } },
      MuiTablePagination: { defaultProps: { labelDisplayedRows } },
    },
  });
};
