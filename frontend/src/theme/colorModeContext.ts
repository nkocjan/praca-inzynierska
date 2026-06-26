import * as React from "react";

export type ThemeMode = "light" | "dark";

export interface ColorModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const COLOR_MODE_STORAGE_KEY = "nkThemeMode";

export const ColorModeContext =
  React.createContext<ColorModeContextValue | null>(null);
