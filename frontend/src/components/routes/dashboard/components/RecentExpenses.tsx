import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { ExpenseUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatCurrencyPLN } from "../../../../i18n/locale";
import DashboardCard from "./DashboardCard";

interface RecentExpensesProps {
  expenses: ExpenseUiDTO[];
  colorById: Map<string, string>;
  fallbackColor: string;
}

const RecentExpenses = ({ expenses, colorById, fallbackColor }: RecentExpensesProps) => {
  const { t, i18n } = useTranslation("dashboard");
  const language = normalizeLanguage(i18n.language);

  return (
    <DashboardCard
      title={t("recent.title")}
      action={
        <Button
          component={RouterLink}
          to="/expenses"
          size="small">
          {t("recent.seeAll")}
        </Button>
      }>
      {expenses.length === 0 ? (
        <Typography color="text.secondary">{t("recent.empty")}</Typography>
      ) : (
        <Stack
          component="ul"
          spacing={0.5}
          sx={{ listStyle: "none", p: 0, m: 0 }}>
          {expenses.map(expense => {
            const color = colorById.get(expense.category?.id ?? "") ?? fallbackColor;
            return (
              <Stack
                component="li"
                key={expense.id}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ py: 1 }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    borderRadius: "10px",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "text.primary",
                    backgroundColor: alpha(color, 0.2),
                  }}>
                  {expense.category?.name?.[0] ?? "?"}
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600 }}
                    noWrap>
                    {expense.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    component="p">
                    {expense.category?.name} · {dayjs(expense.date).locale(language).format("D MMM, HH:mm")}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                  {formatCurrencyPLN(Number(expense.amount ?? 0), language)}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      )}
    </DashboardCard>
  );
};

export default RecentExpenses;
