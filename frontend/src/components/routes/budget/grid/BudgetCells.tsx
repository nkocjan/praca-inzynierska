import { ReactNode } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { alpha, useTheme } from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { useTranslation } from "react-i18next";
import { BudgetUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { BudgetTiming, budgetTiming, formatBudgetPeriod } from "../../../../lib/budgetPeriod";
import CategoryAvatar from "../../../../lib/category/CategoryAvatar";

const INLINE_ICON = { fontSize: 13, verticalAlign: "-2px" };

const TwoLines = ({ primary, secondary }: { primary?: string; secondary?: ReactNode }) => (
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
export const BudgetCategoryCell = ({
  budget,
  color,
  compact,
  showEnded = true,
}: {
  budget: BudgetUiDTO;
  color: string;
  compact: boolean;
  showEnded?: boolean;
}) => {
  const { t, i18n } = useTranslation("budgets");
  const theme = useTheme();
  const language = normalizeLanguage(i18n.language);
  const timing = budgetTiming(budget.periodStart, budget.periodEnd);
  const period = formatBudgetPeriod(budget.period, budget.periodStart, budget.periodEnd, language, true);
  const showStatus = timing === "upcoming" || (timing === "ended" && showEnded);
  // A word would not fit next to the period on a phone, so the status is an icon with a hidden label.
  const statusIcon = showStatus && (
    <Box
      component="span"
      title={t(`status.chip.${timing}`)}
      sx={{ color: timing === "upcoming" ? (theme.palette.mode === "light" ? "#92400e" : "warning.main") : "text.secondary" }}>
      {timing === "upcoming" ? <ScheduleRoundedIcon sx={INLINE_ICON} /> : <CheckRoundedIcon sx={INLINE_ICON} />}
      <Box
        component="span"
        sx={visuallyHidden}>
        {t(`status.chip.${timing}`)}
      </Box>
    </Box>
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={compact ? 1 : 1.5}
      sx={{ height: "100%", minWidth: 0 }}>
      <CategoryAvatar
        name={budget.category?.name}
        color={color}
      />
      <TwoLines
        primary={budget.category?.name}
        secondary={
          compact ? (
            <>
              {period}
              {statusIcon && <> {statusIcon}</>}
            </>
          ) : undefined
        }
      />
    </Stack>
  );
};

// A running period needs no label; planned and ended ones get a chip next to the period.
export const BudgetTimingChip = ({ timing }: { timing: Exclude<BudgetTiming, "current"> }) => {
  const { t } = useTranslation("budgets");
  const theme = useTheme();
  const light = theme.palette.mode === "light";
  // Same amber as a planned expense, darkened on light surfaces to keep AA contrast.
  const styles = {
    upcoming: { color: light ? "#92400e" : theme.palette.warning.main, background: alpha(theme.palette.warning.main, light ? 0.14 : 0.16), icon: <ScheduleRoundedIcon /> },
    ended: { color: theme.palette.text.secondary, background: alpha(theme.palette.text.secondary, 0.1), icon: <CheckRoundedIcon /> },
  }[timing];

  return (
    <Chip
      size="small"
      icon={styles.icon}
      label={t(`status.chip.${timing}`)}
      sx={{ height: 22, color: styles.color, backgroundColor: styles.background, "& .MuiChip-icon": { color: "inherit", fontSize: 15 } }}
    />
  );
};

// In the "ended" list every row would carry the same chip, so it can be left out there.
export const BudgetPeriodCell = ({ budget, showEnded = true }: { budget: BudgetUiDTO; showEnded?: boolean }) => {
  const { t, i18n } = useTranslation("budgets");
  const language = normalizeLanguage(i18n.language);
  const timing = budgetTiming(budget.periodStart, budget.periodEnd);

  return (
    <Stack
      justifyContent="center"
      sx={{ height: "100%", minWidth: 0 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600 }}
          noWrap>
          {formatBudgetPeriod(budget.period, budget.periodStart, budget.periodEnd, language)}
        </Typography>
        {(timing === "upcoming" || (timing === "ended" && showEnded)) && <BudgetTimingChip timing={timing} />}
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        noWrap>
        {t(`periodType.${budget.period}`)}
      </Typography>
    </Stack>
  );
};
