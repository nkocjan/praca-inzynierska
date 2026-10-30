import { Box, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "../../i18n/i18n";
import { formatCurrencyPLN, getIntlLocale } from "../../i18n/locale";
import { toneFor, usagePercent } from "../budgetStatus";

interface BudgetUsageProps {
  spent: number;
  limit: number;
  // What the bar is about, read out by screen readers, e.g. "Food, this month".
  label: string;
  // Shown as "spent / limit" (currency once, at the limit) where no other column carries the limit.
  showLimit?: boolean;
  // Phones: a slightly smaller amount line, so long English amounts ("13,552 / PLN 18,000") fit.
  dense?: boolean;
}

// Spent amount over a progress bar with the percentage; near or over the limit it also gets an icon and a tooltip.
const BudgetUsage = ({ spent, limit, label, showLimit = false, dense = false }: BudgetUsageProps) => {
  const { t, i18n } = useTranslation("common");
  const theme = useTheme();
  const language = normalizeLanguage(i18n.language);
  const money = (amount: number) => formatCurrencyPLN(amount, language, 0);
  const number = (amount: number) => new Intl.NumberFormat(getIntlLocale(language), { maximumFractionDigits: 0 }).format(amount);
  const percent = usagePercent(spent, limit);
  const tone = toneFor(percent);
  // Darker amber than the palette's warning colour, so the text passes AA contrast on white.
  const warningText = theme.palette.mode === "light" ? "#92400e" : theme.palette.warning.main;
  const statusText =
    tone === "error"
      ? t("usage.over", { amount: money(spent - limit) })
      : tone === "warning"
        ? t("usage.near")
        : undefined;
  const aria = t("usage.aria", { label, spent: money(spent), limit: money(limit), percent: Math.round(percent) });

  const percentLabel = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      justifyContent="flex-end"
      sx={{
        flexShrink: 0,
        minWidth: 40,
        color: tone === "error" ? "error.main" : tone === "warning" ? warningText : "text.secondary",
      }}>
      {tone === "error" && <ErrorOutlineRoundedIcon sx={{ fontSize: 15 }} />}
      {tone === "warning" && <WarningAmberRoundedIcon sx={{ fontSize: 15 }} />}
      <Typography
        variant="caption"
        sx={{ fontWeight: tone === "primary" ? 500 : 700, fontVariantNumeric: "tabular-nums" }}>
        {Math.round(percent)}%
      </Typography>
    </Stack>
  );

  return (
    <Stack
      justifyContent="center"
      spacing={0.5}
      sx={{ height: "100%", width: "100%", minWidth: 0 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        noWrap
        sx={{ fontVariantNumeric: "tabular-nums", ...(dense && { fontSize: "0.8125rem" }) }}>
        <Box
          component="span"
          sx={{ color: "text.primary", fontWeight: 600 }}>
          {showLimit ? number(spent) : money(spent)}
        </Box>
        {showLimit && ` / ${money(limit)}`}
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}>
        <LinearProgress
          variant="determinate"
          color={tone}
          value={Math.min(percent, 100)}
          aria-label={statusText ? `${aria}. ${statusText}` : aria}
          sx={{ height: 6, flexGrow: 1 }}
        />
        {statusText ? (
          <Tooltip title={statusText}>
            <Box sx={{ cursor: "default" }}>{percentLabel}</Box>
          </Tooltip>
        ) : (
          percentLabel
        )}
      </Stack>
    </Stack>
  );
};

export default BudgetUsage;
