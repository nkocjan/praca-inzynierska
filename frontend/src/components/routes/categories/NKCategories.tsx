import Grid from "@mui/material/Grid2";
import { Button } from "@mui/material";

const NKCategories = () => {
  return (
    <Grid container spacing={3} sx={{ padding: 3, marginTop: 5 }}>
      <Grid container size={3} sx={{ textAlign: "center" }}>
        <Grid size={4}>
          <Button>Dodaj kategorię</Button>
        </Grid>
        <Grid size={4}>
          <Button>Generuj raport</Button>
        </Grid>
        <Grid size={4}>
          <Button>Przeglądaj budżety</Button>
        </Grid>
        <Grid size={12}>wyk1</Grid>
        <Grid size={12}>wyk1</Grid>
      </Grid>
      <Grid container size={9} sx={{ textAlign: "center" }}>
        <Grid>xd</Grid>
      </Grid>
    </Grid>
  );
};
export default NKCategories;
