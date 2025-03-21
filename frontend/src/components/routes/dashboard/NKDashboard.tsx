import Grid from "@mui/material/Grid2";
import ExpanseList from "./components/ExpanseList";
import PieChart from "./components/PieChart";
import DashBarChart from "./components/DashBarChart";
import ConfigurationBox from "./components/ConfigurationBox";

const height = 250;
const height2 = "42vh";

const NKDashboard = () => {
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
          <ExpanseList height={height}></ExpanseList>
        </Grid>
        <Grid
          size={9}
          container>
          <Grid size={4}>
            <PieChart
              height={height}
              type="week"></PieChart>
          </Grid>
          <Grid size={4}>
            <PieChart
              height={height}
              type="month"></PieChart>
          </Grid>
          <Grid size={4}>
            <PieChart
              height={height}
              type="year"></PieChart>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        size={12}>
        <Grid size={7}>
          <DashBarChart height={height2}></DashBarChart>
        </Grid>
        <Grid size={5}>
          <ConfigurationBox height={height2}></ConfigurationBox>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NKDashboard;
