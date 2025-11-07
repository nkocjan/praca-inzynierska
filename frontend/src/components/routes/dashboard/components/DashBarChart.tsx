import { Paper } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

interface DashBarChartProperties {
  height?: number | string;
  labels: string[];
  expensesData: number[];
  budgetData: number[];
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem: any) => {
          const label = tooltipItem.dataset.label || "";
          const value = tooltipItem.raw || 0;
          return `${label}: ${value} zł`;
        },
      },
    },
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const polishMonthMap: { [key: string]: string } = {
  "01": "sty",
  "02": "lut",
  "03": "mar",
  "04": "kwi",
  "05": "maj",
  "06": "cze",
  "07": "lip",
  "08": "sie",
  "09": "wrz",
  "10": "paź",
  "11": "lis",
  "12": "gru",
};

const formatLabels = (labels: string[]): string[] => {
  return labels.map((label) => {
    const parts = label.split("-");
    if (parts.length === 2) {
      const monthNumber = parts[1];
      const shortYear = parts[0].substring(2);
      const monthName = polishMonthMap[monthNumber];

      return `${monthName} '${shortYear}`;
    }
    return label;
  });
};

const DashBarChart = (props: DashBarChartProperties) => {
  const data = {
    labels: formatLabels(props.labels),
    datasets: [
      {
        label: "Wydatki",
        data: props.expensesData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Budżet",
        data: props.budgetData,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <Paper sx={{ height: props.height, padding: 2 }}>
      <Bar options={options} data={data} />
    </Paper>
  );
};

export default DashBarChart;
