import { Paper } from "@mui/material";

interface DashBarChartProperties {
  height?: number | string;
}

const DashBarChart = (props: DashBarChartProperties) => {
  return <Paper sx={{ height: props.height }}></Paper>;
};

export default DashBarChart;
