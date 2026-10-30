import { useMemo, useState } from "react";
import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { BarChartDataPairUiDTO, CategoryRepDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatCurrencyPLN } from "../../../../i18n/locale";
import { useChartColors } from "../../../../theme/chartColors";
import DashboardCard from "./DashboardCard";

ChartJS.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const ALL = "all";

interface SpendingTrendProps {
  series: BarChartDataPairUiDTO[];
  categories: CategoryRepDTO[];
}

const SpendingTrend = ({ series, categories }: SpendingTrendProps) => {
  const { t, i18n } = useTranslation("dashboard");
  const language = normalizeLanguage(i18n.language);
  const colors = useChartColors();
  const [selected, setSelected] = useState<string>(ALL);

  const { labels, expenses, budget } = useMemo(() => {
    const picked = selected === ALL ? series : series.filter(pair => pair.categoryId === selected);
    const months = picked[0]?.data?.labels ?? [];
    const sum = (key: "expensesData" | "budgetData") =>
      months.map((_, index) => picked.reduce((total, pair) => total + Number(pair.data?.[key]?.[index] ?? 0), 0));
    return { labels: months, expenses: sum("expensesData"), budget: sum("budgetData") };
  }, [series, selected]);

  const monthLabels = labels.map(label => dayjs(`${label}-01`).locale(language).format("MMM YY"));

  const data = {
    labels: monthLabels,
    datasets: [
      {
        type: "bar" as const,
        label: t("trend.expenses"),
        data: expenses,
        backgroundColor: colors.categorical[0],
        borderRadius: 4,
        maxBarThickness: 36,
        order: 2,
      },
      {
        type: "line" as const,
        label: t("trend.budget"),
        data: budget,
        borderColor: colors.text,
        backgroundColor: colors.text,
        borderWidth: 2,
        stepped: "middle" as const,
        pointRadius: 0,
        pointHoverRadius: 4,
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        reverse: true,
        labels: { color: colors.text, usePointStyle: true, pointStyle: "rectRounded", boxWidth: 8, boxHeight: 8 },
      },
      tooltip: {
        ...colors.tooltip,
        padding: 10,
        itemSort: (a: TooltipItem<"bar" | "line">, b: TooltipItem<"bar" | "line">) => a.datasetIndex - b.datasetIndex,
        callbacks: {
          label: (item: TooltipItem<"bar" | "line">) =>
            ` ${item.dataset.label}: ${formatCurrencyPLN(Number(item.raw), language)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: colors.grid },
        ticks: { color: colors.text },
      },
      y: {
        beginAtZero: true,
        grid: { color: colors.grid },
        border: { display: false },
        ticks: {
          color: colors.text,
          maxTicksLimit: 5,
          callback: (value: string | number) => formatCurrencyPLN(Number(value), language, 0),
        },
      },
    },
  };

  return (
    <DashboardCard
      title={t("trend.title")}
      subtitle={t("trend.subtitle")}
      action={
        <TextField
          select
          size="small"
          label={t("trend.category")}
          value={selected}
          onChange={event => setSelected(event.target.value)}
          sx={{ minWidth: 200 }}>
          <MenuItem value={ALL}>{t("trend.allCategories")}</MenuItem>
          {categories.map(category => (
            <MenuItem
              key={category.id}
              value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      }>
      {labels.length === 0 ? (
        <Typography color="text.secondary">{t("trend.empty")}</Typography>
      ) : (
        <>
          <Box sx={{ height: 300 }}>
            <Chart
              type="bar"
              data={data}
              options={options}
              aria-label={t("trend.title")}
              role="img"
            />
          </Box>
          <Box
            component="table"
            sx={visuallyHidden}>
            <caption>{t("trend.title")}</caption>
            <thead>
              <tr>
                <th scope="col">{t("trend.subtitle")}</th>
                <th scope="col">{t("trend.expenses")}</th>
                <th scope="col">{t("trend.budget")}</th>
              </tr>
            </thead>
            <tbody>
              {monthLabels.map((label, index) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{formatCurrencyPLN(expenses[index], language)}</td>
                  <td>{formatCurrencyPLN(budget[index], language)}</td>
                </tr>
              ))}
            </tbody>
          </Box>
        </>
      )}
    </DashboardCard>
  );
};

export default SpendingTrend;
