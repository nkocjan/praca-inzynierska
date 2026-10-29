import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  COLOR_MODE_STORAGE_KEY,
  ColorModeContext,
  ThemeMode,
} from "./colorModeContext";

const readInitialMode = (): ThemeMode => {
  const raw = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  return raw === "light" || raw === "dark" ? raw : "dark";
};

const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => readInitialMode());

  useEffect(() => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, toggleMode],
  );

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
};

export default ColorModeProvider;
