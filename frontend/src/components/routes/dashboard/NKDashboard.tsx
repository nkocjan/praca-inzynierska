import Grid from "@mui/material/Grid2";
import ExpanseList from "./components/ExpanseList";
import PieChart from "./components/PieChart";
import DashBarChart from "./components/DashBarChart";
import ConfigurationBox from "./components/ConfigurationBox";
import { useEffect, useMemo, useState } from "react";
import {
  BarChartDataPairUiDTO,
  BarChartDataUiDTO,
  CategoryRepDTO,
  DashboardDataResponseUiDTO,
  ExpenseUiDTO,
  PieChartDataUiDTO,
} from "../../../api/generated";
import { apiClient } from "../../../api/apiClient.ts";
import { useTranslation } from "react-i18next";

const height = 250;
const height2 = "42vh";

type TransformedBarChartData = {
  [key: string]: BarChartDataUiDTO;
};

const NKDashboard = () => {
  const { t } = useTranslation("dashboard");
  const [dashboardData, setDashboardData] =
    useState<DashboardDataResponseUiDTO | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<DashboardDataResponseUiDTO>(
          "/api/bff/expenses/dashboard",
        );

        setDashboardData(response.data);
        const firstCategoryId = response.data.categories?.[0]?.id;
        setSelectedCategory((firstCategoryId as string) || "");
      } catch (error) {
        console.error("Błąd pobierania danych z dashboardu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

  useEffect(() => {
    const categories = dashboardData?.categories ?? [];
    if (categories.length === 0) {
      if (selectedCategory !== "") setSelectedCategory("");
      return;
    }

    const exists = categories.some(c => (c.id as string) === selectedCategory);
    if (!exists) {
      setSelectedCategory((categories[0].id as string) || "");
    }
  }, [dashboardData?.categories, selectedCategory]);

  const transformedBarData = useMemo((): TransformedBarChartData => {
    if (!dashboardData?.barChartData) return {};

    return (dashboardData.barChartData as BarChartDataPairUiDTO[]).reduce(
      (acc, pair) => {
        const categoryId = pair.categoryId as string | undefined;
        if (categoryId && pair.data) {
          acc[categoryId] = pair.data;
        }
        return acc;
      },
      {} as TransformedBarChartData,
    );
  }, [dashboardData?.barChartData]);

  const chartData = transformedBarData[selectedCategory] || {
    labels: [],
    expensesData: [],
    budgetData: [],
  };

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (!dashboardData) {
    return <div>{t("loadError")}</div>;
  }

  return (
    <Grid
      container
      spacing={2}
      sx={{ padding: 3, marginTop: 5 }}>
      <Grid
        container
        spacing={2}
        size={12}>
        <Grid size={3}>
          <ExpanseList
            height={height}
            expenses={(dashboardData.expenses as ExpenseUiDTO[]) ?? []}
          />
        </Grid>
        <Grid
          size={9}
          container>
          <Grid size={4}>
            <PieChart
              height={height}
              type="week"
              chartData={dashboardData.weeklyPieChart as PieChartDataUiDTO}
            />
          </Grid>
          <Grid size={4}>
            <PieChart
              height={height}
              type="month"
              chartData={dashboardData.monthlyPieChart as PieChartDataUiDTO}
            />
          </Grid>
          <Grid size={4}>
            <PieChart
              height={height}
              type="year"
              chartData={dashboardData.yearlyPieChart as PieChartDataUiDTO}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        size={12}>
        <Grid size={7}>
          <DashBarChart
            height={height2}
            labels={chartData.labels as string[]}
            expensesData={chartData.expensesData as number[]}
            budgetData={chartData.budgetData as number[]}
          />
        </Grid>
        <Grid size={5}>
          <ConfigurationBox
            height={height2}
            categories={(dashboardData.categories as CategoryRepDTO[]) ?? []}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NKDashboard;
