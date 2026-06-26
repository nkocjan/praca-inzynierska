import { Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { getCurrencySymbol } from "../../../../i18n/locale";
import dayjs from "dayjs";
import type { AppLanguage } from "../../../../i18n/i18n";

interface DashBarChartProperties {
  height?: number | string;
  labels: string[];
  expensesData: number[];
  budgetData: number[];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

const formatLabels = (labels: string[], language: AppLanguage): string[] => {
  return labels.map(label => {
    const parts = label.split("-");
    if (parts.length === 2) {
      const [year, month] = parts;
      const date = dayjs(`${year}-${month}-01`).locale(language);
      if (!date.isValid()) return label;
      return date.format("MMM 'YY");
    }
    return label;
  });
};

const DashBarChart = (props: DashBarChartProperties) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation(["dashboard", "common"]);
  const language = normalizeLanguage(i18n.language);
  const currencySymbol = getCurrencySymbol(language);

  const hasData =
    (props.labels?.length || 0) > 0 &&
    ((props.expensesData?.length || 0) > 0 ||
      (props.budgetData?.length || 0) > 0);

  const options = {
    responsive: true,
    layout: {
      padding: {
        top: 8,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
      datalabels: {
        color: theme.palette.text.primary,
        font: {
          weight: "bold" as const,
        },
        anchor: "end" as const,
        align: "end" as const,
        offset: 4,
        clamp: true,
        clip: true,
        formatter: (value: unknown) => {
          const numberValue = Number(value);
          if (!Number.isFinite(numberValue) || numberValue === 0) return "";
          return numberValue;
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"bar">) => {
            const label = tooltipItem.dataset.label ?? "";
            const value = Number(tooltipItem.raw) || 0;
            return `${label}: ${value} ${currencySymbol}`;
          },
        },
      },
    },
  };

  const data = {
    labels: formatLabels(props.labels, language),
    datasets: [
      {
        label: t("dashboard:expenses"),
        data: props.expensesData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: t("dashboard:budget"),
        data: props.budgetData,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <Paper sx={{ height: props.height, padding: 2 }}>
      {hasData ? (
        <Bar
          options={options}
          data={data}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{ opacity: 0.9 }}>
          {t("common:noData")}
        </Typography>
      )}
    </Paper>
  );
};

export default DashBarChart;
