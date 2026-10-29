import { useTheme } from "@mui/material/styles";
import { Chart as ChartJS } from "chart.js";

// Categorical palette, validated for colour-blind separation on both card surfaces
// (#ffffff light, #141b2d dark). Slots are assigned in this fixed order and never cycled:
// categories past the last slot share the neutral "other" colour.
const CATEGORICAL = {
  light: ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6"],
  dark: ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9"],
};
const OTHER = { light: "#94a3b8", dark: "#64748b" };

ChartJS.defaults.font.family = '"Inter Variable", Inter, system-ui, sans-serif';

export const useChartColors = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  return {
    categorical: CATEGORICAL[mode],
    other: OTHER[mode],
    text: theme.palette.text.secondary,
    grid: mode === "light" ? "#e2e8f0" : "rgba(148, 163, 184, 0.14)",
    surface: theme.palette.background.paper,
    tooltip: {
      backgroundColor: mode === "light" ? "#0f172a" : "#e5e7eb",
      titleColor: mode === "light" ? "#ffffff" : "#0f172a",
      bodyColor: mode === "light" ? "#e2e8f0" : "#1f2937",
    },
  };
};

// Colour follows the category, not its rank: the same category keeps its colour in every chart.
export const buildCategoryColors = (
  categoryIds: string[],
  palette: string[],
  other: string,
): Map<string, string> => {
  const map = new Map<string, string>();
  categoryIds.forEach((id, index) => map.set(id, palette[index] ?? other));
  return map;
};
