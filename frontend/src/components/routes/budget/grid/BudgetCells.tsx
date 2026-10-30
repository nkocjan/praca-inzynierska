import { Box, Chip, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { useTranslation } from "react-i18next";
import { BudgetUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { BudgetTiming, formatBudgetPeriod } from "../../../../lib/budgetPeriod";
import CategoryAvatar from "../../../../lib/category/CategoryAvatar";

const TwoLines = ({ primary, secondary }: { primary?: string; secondary?: string }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      variant="body2"
      sx={{ fontWeight: 600 }}
      noWrap>
      {primary}
    </Typography>
    {secondary && (
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        noWrap>
        {secondary}
      </Typography>
    )}
  </Box>
);

// On phones the period moves under the category name; on wider screens it has its own column.
export const BudgetCategoryCell = ({ budget, color, compact }: { budget: BudgetUiDTO; color: string; compact: boolean }) => {
  const { i18n } = useTranslation("budgets");
  const language = normalizeLanguage(i18n.language);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ height: "100%", minWidth: 0 }}>
      <CategoryAvatar
        name={budget.category?.name}
        color={color}
      />
      <TwoLines
        primary={budget.category?.name}
        secondary={compact ? formatBudgetPeriod(budget.period, budget.periodStart, budget.periodEnd, language, true) : undefined}
      />
    </Stack>
  );
};

export const BudgetPeriodCell = ({ budget }: { budget: BudgetUiDTO }) => {
  const { t, i18n } = useTranslation("budgets");
  const language = normalizeLanguage(i18n.language);

  return (
    <Stack
      justifyContent="center"
      sx={{ height: "100%" }}>
      <TwoLines
        primary={formatBudgetPeriod(budget.period, budget.periodStart, budget.periodEnd, language)}
        secondary={t(`periodType.${budget.period}`)}
      />
    </Stack>
  );
};

export const BudgetTimingChip = ({ timing }: { timing: BudgetTiming }) => {
  const { t } = useTranslation("budgets");
  const theme = useTheme();
  const light = theme.palette.mode === "light";
  // Same amber as a planned expense, darkened on light surfaces to keep AA contrast.
  const styles = {
    current: { color: theme.palette.primary.main, background: alpha(theme.palette.primary.main, light ? 0.1 : 0.16), icon: <HourglassTopRoundedIcon /> },
    upcoming: { color: light ? "#92400e" : theme.palette.warning.main, background: alpha(theme.palette.warning.main, light ? 0.14 : 0.16), icon: <ScheduleRoundedIcon /> },
    ended: { color: theme.palette.text.secondary, background: alpha(theme.palette.text.secondary, 0.1), icon: <CheckRoundedIcon /> },
  }[timing];

  return (
    <Chip
      size="small"
      icon={styles.icon}
      label={t(`status.chip.${timing}`)}
      sx={{ color: styles.color, backgroundColor: styles.background, "& .MuiChip-icon": { color: "inherit", fontSize: 16 } }}
    />
  );
};
