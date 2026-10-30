import { Box, Chip, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { ExpenseUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatCurrencyPLN, formatDate } from "../../../../i18n/locale";
import CategoryAvatar from "../../../../lib/category/CategoryAvatar";

export const ExpenseStatusChip = ({ planned }: { planned: boolean }) => {
  const { t } = useTranslation("expenses");
  const theme = useTheme();
  const light = theme.palette.mode === "light";
  // Darker text than the palette's warning colour, so the label passes AA contrast on the tinted chip.
  const color = planned ? (light ? "#92400e" : theme.palette.warning.main) : theme.palette.text.secondary;
  const background = planned ? alpha(theme.palette.warning.main, light ? 0.14 : 0.16) : alpha(theme.palette.text.secondary, 0.1);

  return (
    <Chip
      size="small"
      icon={planned ? <ScheduleRoundedIcon /> : <CheckRoundedIcon />}
      label={planned ? t("status.chipPlanned") : t("status.chipPaid")}
      sx={{ color, backgroundColor: background, "& .MuiChip-icon": { color: "inherit", fontSize: 16 } }}
    />
  );
};

export const CategoryLabel = ({ name, color }: { name?: string; color: string }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1}
    sx={{ minWidth: 0 }}>
    <Box
      aria-hidden
      sx={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, backgroundColor: color }}
    />
    <Typography
      variant="body2"
      noWrap>
      {name}
    </Typography>
  </Stack>
);

interface NameCellProps {
  expense: ExpenseUiDTO;
  color: string;
  compact: boolean;
}

export const NameCell = ({ expense, color, compact }: NameCellProps) => {
  const { i18n } = useTranslation("expenses");
  const language = normalizeLanguage(i18n.language);
  // On phones category, date and status move under the name; on wider screens they have their own columns.
  const date = dayjs(expense.date);
  const shortDate = formatDate(date, language, date.isSame(dayjs(), "year") ? "D MMM" : "D MMM YYYY");
  const secondary = compact
    ? [expense.category?.name, shortDate].filter(Boolean).join(" · ")
    : expense.description;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ height: "100%", minWidth: 0 }}>
      <CategoryAvatar
        name={expense.category?.name}
        color={color}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600 }}
          noWrap>
          {expense.name}
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
    </Stack>
  );
};

// On phones the status column is hidden, so a planned expense says so under its amount.
export const AmountCell = ({ expense, compact }: { expense: ExpenseUiDTO; compact: boolean }) => {
  const { t, i18n } = useTranslation("expenses");
  const theme = useTheme();
  const amount = formatCurrencyPLN(Number(expense.amount ?? 0), normalizeLanguage(i18n.language));

  return (
    <Stack
      alignItems="flex-end"
      justifyContent="center"
      sx={{ height: "100%" }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
        {amount}
      </Typography>
      {compact && expense.isPlanned && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ color: theme.palette.mode === "light" ? "#92400e" : "warning.main" }}>
          <ScheduleRoundedIcon sx={{ fontSize: 13 }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 600 }}>
            {t("status.chipPlanned")}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
