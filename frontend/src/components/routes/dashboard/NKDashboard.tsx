import Grid from "@mui/material/Grid2";
import ExpanseList from "./components/ExpanseList";
import PieChart from "./components/PieChart";
import DashBarChart from "./components/DashBarChart";
import ConfigurationBox from "./components/ConfigurationBox";
import { useEffect, useMemo, useState } from "react";
import {
  BarChartDataUiDTO,
  CategoryRepDTO,
  DashboardDataResponseUiDTO,
  ExpenseUiDTO,
  PieChartDataUiDTO,
} from "../../../api/generated";
import { apiClient } from "../../../api/apiClient.ts";

const height = 250;
const height2 = "42vh";

type TransformedBarChartData = {
  [key: string]: BarChartDataUiDTO;
};

const NKDashboard = () => {
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
        if (response.data.categories && response.data.categories.length > 0) {
          setSelectedCategory(response.data.categories[0].id as string);
        }
      } catch (error) {
        console.error("Błąd pobierania danych z dashboardu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

  const transformedBarData = useMemo((): TransformedBarChartData => {
    if (!dashboardData?.barChartData) return {};

    return dashboardData.barChartData.reduce((acc, pair) => {
      if (pair.data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        acc[pair.categoryId] = pair.data;
      }
      return acc;
    }, {} as TransformedBarChartData);
  }, [dashboardData?.barChartData]);

  const chartData = transformedBarData[selectedCategory] || {
    labels: [],
    expensesData: [],
    budgetData: [],
  };

  if (isLoading) {
    return <div>Ładowanie danych...</div>;
  }

  if (!dashboardData) {
    return <div>Wystąpił błąd podczas ładowania danych.</div>;
  }

  return (
    <Grid container spacing={2} sx={{ padding: 3, marginTop: 5 }}>
      <Grid container spacing={2} size={12}>
        <Grid size={3}>
          <ExpanseList
            height={height}
            expenses={dashboardData.expenses as ExpenseUiDTO[]}
          />
        </Grid>
        <Grid size={9} container>
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

      <Grid container spacing={2} size={12}>
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
            categories={dashboardData.categories as CategoryRepDTO[]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NKDashboard;
