import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../api/apiClient.ts";
import {
  BarChartDataPairUiDTO,
  BudgetUiDTO,
  CategoryRepDTO,
  CategoryUiDTO,
  DashboardDataResponseUiDTO,
  ExpenseUiDTO,
} from "../../../api/generated";
import { useCurrentUser } from "../../../auth/useCurrentUser.ts";
import { normalizeLanguage } from "../../../i18n/i18n";
import { formatCurrencyPLN } from "../../../i18n/locale";
import { useDialog } from "../../../lib/dialog/useDialog";
import { useCategoryColors, useChartColors } from "../../../theme/chartColors";
import AddExpanseForm from "../expenses/forms/AddEditExpanseForm.tsx";
import { toneFor, usagePercent } from "../../../lib/budgetStatus";
import CategoryBudgets from "./components/CategoryBudgets";
import RecentExpenses from "./components/RecentExpenses";
import SpendingBreakdown from "./components/SpendingBreakdown";
import SpendingTrend from "./components/SpendingTrend";
import StatCard from "./components/StatCard";

interface DashboardState {
  dashboard: DashboardDataResponseUiDTO;
  categories: CategoryUiDTO[];
  planned: ExpenseUiDTO[];
}

type BudgetKey = "weeklyBudget" | "monthlyBudget" | "yearlyBudget";

const NO_CATEGORIES: CategoryUiDTO[] = [];

const sumBudgets = (categories: CategoryUiDTO[], key: BudgetKey) =>
  categories.reduce(
    (acc, category) => {
      const budget: BudgetUiDTO | undefined = category[key];
      return { spent: acc.spent + (budget?.spentAmount ?? 0), budget: acc.budget + (budget?.amount ?? 0) };
    },
    { spent: 0, budget: 0 },
  );

const loadDashboard = async (): Promise<DashboardState> => {
  const now = dayjs();
  const [dashboard, categories, planned] = await Promise.all([
    apiClient.get<DashboardDataResponseUiDTO>("/api/bff/expenses/dashboard"),
    apiClient.get<CategoryUiDTO[]>("/api/bff/categories"),
    apiClient.post<{ content?: ExpenseUiDTO[] }>(
      "/api/bff/expenses/search?page=0&size=100",
      {
        isPlanned: true,
        dateFrom: now.format("YYYY-MM-DDTHH:mm:ss"),
        dateTo: now.add(30, "day").endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      },
    ),
  ]);
  return { dashboard: dashboard.data, categories: categories.data ?? [], planned: planned.data.content ?? [] };
};

const DashboardSkeleton = () => (
  <Grid
    container
    spacing={3}>
    {[0, 1, 2, 3].map(i => (
      <Grid
        key={i}
        size={{ xs: 12, sm: 6, lg: 3 }}>
        <Skeleton
          variant="rounded"
          height={170}
          sx={{ borderRadius: "16px" }}
        />
      </Grid>
    ))}
    <Grid size={{ xs: 12, lg: 7 }}>
      <Skeleton
        variant="rounded"
        height={420}
        sx={{ borderRadius: "16px" }}
      />
    </Grid>
    <Grid size={{ xs: 12, lg: 5 }}>
      <Skeleton
        variant="rounded"
        height={420}
        sx={{ borderRadius: "16px" }}
      />
    </Grid>
  </Grid>
);

const NKDashboard = () => {
  const { t, i18n } = useTranslation(["dashboard", "expenses"]);
  const language = normalizeLanguage(i18n.language);
  const user = useCurrentUser();
  const colors = useChartColors();
  const { openDialog, closeDialog } = useDialog();
  const [state, setState] = useState<DashboardState | null>(null);
  const [failed, setFailed] = useState(false);

  const reload = useCallback(() => {
    setFailed(false);
    loadDashboard()
      .then(setState)
      .catch(error => {
        console.error("Błąd pobierania danych z dashboardu:", error);
        setFailed(true);
      });
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Colour follows the category, so it is the same in every widget and on the expenses page.
  const { colorById, colorFor } = useCategoryColors(state?.categories ?? NO_CATEGORIES, language);
  const colorByName = useMemo(
    () => new Map((state?.categories ?? []).map(c => [c.name ?? "", colorFor(c.id)])),
    [state?.categories, colorFor],
  );

  const openAddExpense = () =>
    openDialog(
      {
        title: t("expenses:page.addNewExpenseTitle"),
        saveButtonTitle: t("expenses:page.add"),
        cancelButtonTitle: t("expenses:page.cancel"),
        formId: "expense-form",
        maxWidth: "sm",
      },
      <AddExpanseForm
        formId="expense-form"
        onSuccess={() => {
          closeDialog();
          reload();
        }}
      />,
    );

  const money = (amount: number) => formatCurrencyPLN(amount, language, 0);

  const budgetCard = (key: BudgetKey, label: string, icon: ReactNode) => {
    const { spent, budget } = sumBudgets(state?.categories ?? [], key);
    const percent = usagePercent(spent, budget);
    const tone = toneFor(percent);
    const remaining = budget - spent;
    return (
      <StatCard
        label={label}
        value={money(spent)}
        caption={t("dashboard:kpi.ofBudget", { budget: money(budget) })}
        icon={icon}
        tone={tone}
        progress={percent}
        progressLabel={
          remaining >= 0
            ? t("dashboard:kpi.left", { amount: money(remaining) })
            : t("dashboard:kpi.over", { amount: money(-remaining) })
        }
        overLabel={`${Math.round(percent)}%`}
      />
    );
  };

  const plannedTotal = (state?.planned ?? []).reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);
  const plannedCount = state?.planned.length ?? 0;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}>
        <Box>
          <Typography
            variant="h4"
            component="h2">
            {user?.name ? t("dashboard:hello", { name: user.name }) : t("dashboard:helloGeneric")}
          </Typography>
          <Typography color="text.secondary">
            {t("dashboard:subtitle", { month: dayjs().locale(language).format("MMMM YYYY") })}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddRoundedIcon />}
          onClick={openAddExpense}>
          {t("dashboard:addExpense")}
        </Button>
      </Stack>

      {failed && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={reload}>
              {t("dashboard:retry")}
            </Button>
          }>
          {t("dashboard:loadError")}
        </Alert>
      )}

      {!state && !failed && <DashboardSkeleton />}

      {state && (
        <Grid
          container
          spacing={3}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            {budgetCard("monthlyBudget", t("dashboard:kpi.month"), <CalendarMonthOutlinedIcon />)}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            {budgetCard("weeklyBudget", t("dashboard:kpi.week"), <TodayOutlinedIcon />)}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            {budgetCard("yearlyBudget", t("dashboard:kpi.year"), <DateRangeOutlinedIcon />)}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              label={t("dashboard:kpi.planned")}
              value={money(plannedTotal)}
              caption={t("dashboard:kpi.plannedCaption", { count: plannedCount })}
              icon={<EventRepeatOutlinedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <CategoryBudgets
              categories={state.categories}
              colorById={colorById}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <SpendingBreakdown
              charts={{
                week: state.dashboard.weeklyPieChart,
                month: state.dashboard.monthlyPieChart,
                year: state.dashboard.yearlyPieChart,
              }}
              colorByName={colorByName}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <SpendingTrend
              series={(state.dashboard.barChartData as BarChartDataPairUiDTO[]) ?? []}
              categories={(state.dashboard.categories as CategoryRepDTO[]) ?? []}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <RecentExpenses
              expenses={(state.dashboard.expenses as ExpenseUiDTO[]) ?? []}
              colorById={colorById}
              fallbackColor={colors.other}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default NKDashboard;
