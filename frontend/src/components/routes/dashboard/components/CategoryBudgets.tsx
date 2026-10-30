import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CategoryUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatCurrencyPLN } from "../../../../i18n/locale";
import { toneFor, usagePercent } from "../../../../lib/budgetStatus";
import DashboardCard from "./DashboardCard";

const MAX_ROWS = 7;

interface CategoryBudgetsProps {
  categories: CategoryUiDTO[];
  colorById: Map<string, string>;
}

const CategoryBudgets = ({ categories, colorById }: CategoryBudgetsProps) => {
  const { t, i18n } = useTranslation("dashboard");
  const language = normalizeLanguage(i18n.language);

  const rows = categories
    .map(category => {
      const spent = category.monthlyBudget?.spentAmount ?? 0;
      const budget = category.monthlyBudget?.amount ?? 0;
      return { category, spent, budget, percent: usagePercent(spent, budget) };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, MAX_ROWS);

  return (
    <DashboardCard
      title={t("budgets.title")}
      subtitle={t("budgets.subtitle")}
      action={
        <Button
          component={RouterLink}
          to="/categories"
          size="small">
          {t("budgets.seeAll")}
        </Button>
      }>
      {rows.length === 0 ? (
        <Typography color="text.secondary">{t("budgets.empty")}</Typography>
      ) : (
        <Stack spacing={2.25}>
          {rows.map(({ category, spent, budget, percent }) => {
            const tone = toneFor(percent);
            return (
              <Box key={category.id}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 0.75 }}>
                  <Box
                    aria-hidden
                    sx={{ width: 10, height: 10, borderRadius: "3px", flexShrink: 0, backgroundColor: colorById.get(category.id ?? "") }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, flexGrow: 1, minWidth: 0 }}
                    noWrap>
                    {category.name}
                  </Typography>
                  {tone === "error" && (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      sx={{ color: "error.main" }}>
                      <ErrorOutlineRoundedIcon sx={{ fontSize: 16 }} />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600 }}>
                        {t("budgets.over")}
                      </Typography>
                    </Stack>
                  )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                    <Box
                      component="span"
                      sx={{ color: "text.primary", fontWeight: 600 }}>
                      {formatCurrencyPLN(spent, language, 0)}
                    </Box>{" "}
                    / {formatCurrencyPLN(budget, language, 0)}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}>
                  <LinearProgress
                    variant="determinate"
                    color={tone}
                    value={Math.min(percent, 100)}
                    aria-label={`${category.name}: ${Math.round(percent)}%`}
                    sx={{ flexGrow: 1 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ width: 40, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {Math.round(percent)}%
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </DashboardCard>
  );
};

export default CategoryBudgets;
