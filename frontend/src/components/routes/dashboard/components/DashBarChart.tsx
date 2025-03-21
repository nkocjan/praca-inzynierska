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
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [10, 3, 3, 2, 5, 8, 3],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: [6, 13, 7, 4, 5, 8, 13],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashBarChart = (props: DashBarChartProperties) => {
  return (
    <Paper sx={{ height: props.height }}>
      <Bar
        options={options}
        data={data}
      />
    </Paper>
  );
};

export default DashBarChart;
