import { useMemo, useState } from "react";
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ArcElement, Chart as ChartJS, Tooltip, TooltipItem } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { PieChartDataUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatCurrencyPLN } from "../../../../i18n/locale";
import { useChartColors } from "../../../../theme/chartColors";
import DashboardCard from "./DashboardCard";

ChartJS.register(ArcElement, Tooltip);

type Period = "week" | "month" | "year";
const PERIODS: Period[] = ["week", "month", "year"];
// A donut stays readable up to six slices; smaller categories are folded into "Other".
const MAX_SLICES = 6;

interface SpendingBreakdownProps {
  charts: Record<Period, PieChartDataUiDTO | undefined>;
  colorByName: Map<string, string>;
}

const SpendingBreakdown = ({ charts, colorByName }: SpendingBreakdownProps) => {
  const { t, i18n } = useTranslation("dashboard");
  const language = normalizeLanguage(i18n.language);
  const colors = useChartColors();
  const [period, setPeriod] = useState<Period>("month");

  const slices = useMemo(() => {
    const chart = charts[period];
    const all = (chart?.labels ?? [])
      .map((label, index) => ({ label, value: Number(chart?.data?.[index] ?? 0) }))
      .filter(slice => slice.value > 0)
      .sort((a, b) => b.value - a.value);
    if (all.length <= MAX_SLICES) {
      return all.map(slice => ({ ...slice, color: colorByName.get(slice.label) ?? colors.other }));
    }
    const head = all.slice(0, MAX_SLICES - 1).map(slice => ({ ...slice, color: colorByName.get(slice.label) ?? colors.other }));
    const rest = all.slice(MAX_SLICES - 1).reduce((sum, slice) => sum + slice.value, 0);
    return [...head, { label: t("structure.other"), value: rest, color: colors.other }];
  }, [charts, period, colorByName, colors.other, t]);

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  const data = {
    labels: slices.map(slice => slice.label),
    datasets: [
      {
        data: slices.map(slice => slice.value),
        backgroundColor: slices.map(slice => slice.color),
        borderColor: colors.surface,
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        ...colors.tooltip,
        padding: 10,
        callbacks: {
          label: (item: TooltipItem<"doughnut">) =>
            ` ${item.label}: ${formatCurrencyPLN(Number(item.raw), language)}`,
        },
      },
    },
  };

  return (
    <DashboardCard
      title={t("structure.title")}
      action={
        <ToggleButtonGroup
          value={period}
          exclusive
          size="small"
          aria-label={t("structure.period")}
          onChange={(_event, value: Period | null) => value && setPeriod(value)}>
          {PERIODS.map(p => (
            <ToggleButton
              key={p}
              value={p}
              sx={{ px: 1.25, py: 0.5 }}>
              {t(`structure.${p}`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      }>
      {total === 0 ? (
        <Typography color="text.secondary">{t("structure.empty")}</Typography>
      ) : (
        <Stack
          direction={{ xs: "column", sm: "row", lg: "column", xl: "row" }}
          spacing={3}
          alignItems="center">
          <Box sx={{ position: "relative", width: 200, height: 200, flexShrink: 0 }}>
            <Doughnut
              data={data}
              options={options}
              aria-label={t("structure.title")}
              role="img"
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                pointerEvents: "none",
                textAlign: "center",
              }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary">
                  {t("structure.total")}
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  sx={{ lineHeight: 1.2 }}>
                  {formatCurrencyPLN(total, language, 0)}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Stack
            component="ul"
            spacing={1.25}
            sx={{ listStyle: "none", p: 0, m: 0, width: "100%" }}>
            {slices.map(slice => (
              <Stack
                component="li"
                key={slice.label}
                direction="row"
                alignItems="center"
                spacing={1}>
                <Box
                  aria-hidden
                  sx={{ width: 10, height: 10, borderRadius: "3px", flexShrink: 0, backgroundColor: slice.color }}
                />
                <Typography
                  variant="body2"
                  sx={{ flexGrow: 1, minWidth: 0 }}
                  noWrap>
                  {slice.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {formatCurrencyPLN(slice.value, language, 0)}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ width: 36, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {Math.round((slice.value / total) * 100)}%
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </DashboardCard>
  );
};

export default SpendingBreakdown;
