import { Paper } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ChartDataLabels);

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: [
    "Wynajwddwddddddddddem",
    "Jedzenie",
    "Inne",
    "Zakupy",
    "Mieszkanie",
    "Rozrywka",
  ],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

interface PieChartProperties {
  type: "week" | "month" | "year";
  height?: number | string;
}

const PieChart = (props: PieChartProperties) => {
  let shouldHideLegend = true;
  let rows = 1;
  let len = 0;

  for (let i = 0; i < data.labels.length; i++) {
    if (len + data.labels[i].length > 18) {
      rows++;
      len = 0;
    }

    len += data.labels[i].length;
  }

  if (rows < 4) {
    shouldHideLegend = false;
  }

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: !(data.labels.length <= 8 && !shouldHideLegend),
        color: "white",
        font: {
          size: 11,
          weight: "bold",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (value: any, ctx: any) => {
          const total = ctx.chart.data.datasets[0].data.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any, b: any) => a + b,
            0
          );
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
        display: data.labels.length <= 8 && !shouldHideLegend,
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
            const dataset = tooltipItem.dataset;
            const index = tooltipItem.dataIndex;
            const label = dataset.labels ? dataset.labels[index] : "";
            const value = dataset.data[index];
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
      }}>
      <Pie
        data={data}
        options={options}
      />
    </Paper>
  );
};

export default PieChart;
