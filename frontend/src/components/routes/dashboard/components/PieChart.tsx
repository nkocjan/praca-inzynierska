import { Paper } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { PieChartDataUiDTO } from "../../../../api/generated";
ChartJS.register(ChartDataLabels);

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProperties {
  type: "week" | "month" | "year";
  height?: number | string;
  chartData: PieChartDataUiDTO;
}

const backgroundColors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(46, 204, 113, 0.2)",
  "rgba(231, 76, 60, 0.2)",
];

const borderColors = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(46, 204, 113, 1)",
  "rgba(231, 76, 60, 1)",
];

const PieChart = (props: PieChartProperties) => {
  const labels = props.chartData?.labels || [];
  const chartData = props.chartData?.data || [];

  let shouldHideLegend = true;
  let rows = 1;
  let len = 0;

  for (let i = 0; i < labels.length; i++) {
    if (len + labels[i]?.length || 0 > 18) {
      rows++;
      len = 0;
    }

    len += labels[i].length;
  }

  if (rows < 4) {
    shouldHideLegend = false;
  }

  const data = {
    labels: props.chartData.labels,
    datasets: [
      {
        label: "Wydatki",
        data: props.chartData.data,
        backgroundColor: labels.map(
          (_, i) => backgroundColors[i % backgroundColors.length],
        ),
        borderColor: labels.map(
          (_, i) => borderColors[i % borderColors.length],
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: !(labels.length <= 8 && !shouldHideLegend),
        color: "white",
        font: {
          size: 11,
          weight: "bold",
        },
        formatter: (value: number, ctx: unknown) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const total = ctx.chart.data.datasets[0].data.reduce(
            (a: number, b: number) => a + b,
            0,
          );
          if (total === 0) return "0%";
          let percentage = ((value / total) * 100).toFixed(1) + "%";
          if (parseFloat(((value / total) * 100).toFixed(1)) < 5) {
            percentage = "";
          }
          return percentage as string;
        },
        anchor: "center",
        align: "end",
        offset: 5,
      },
      legend: {
        display: labels.length > 0 && labels.length <= 8 && !shouldHideLegend,
        position: "top" as const,
        labels: {
          pointStyle: "circle",
          usePointStyle: true,
          boxHeight: 8,
          font: {
            size: 13,
          },
          color: "white",
        },
      },
      title: {
        display: true,
        text: `Ten ${
          props.type == "week"
            ? "tydzień"
            : props.type == "month"
              ? "miesiąc"
              : "rok"
        }`,
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (tooltipItem: any) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} zł`;
          },
        },
      },
    },
  };

  return (
    <Paper
      sx={{
        height: props.height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "transparent",
        boxShadow: "none",
        paddingBottom: 1,
      }}
    >
      {chartData.length > 0 ? (
        <Pie data={data} options={options as never}></Pie>
      ) : (
        <p>Brak danych</p>
      )}
    </Paper>
  );
};

export default PieChart;
