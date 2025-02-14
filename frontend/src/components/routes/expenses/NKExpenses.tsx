import { NKButton } from "../../../lib/button/Button.tsx";
import Grid from "@mui/material/Grid2";
import NKGrid from "../../../lib/grid/NKGrid.tsx";
import expansesColumns from "../../../lib/grid/expansesColumns.tsx";
import { EXPANSES_MOCK } from "../../../assets/mocks/ExpansesMock.ts";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const NKExpenses = () => {
  console.log("NKExpenses render");
  return (
    <Grid container spacing={3} sx={{ padding: 3, marginTop: 5 }}>
      <Grid>
        <NKButton title="Dodaj wydatek"></NKButton>
      </Grid>
      <Grid>
        <NKButton title="Wczytaj wydatek z pliku"></NKButton>
      </Grid>
      <Grid
        size={12}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <NKGrid
            sx={{
              minHeight: 300,
              height: "auto",
              maxHeight: "73vh",
              flexGrow: 1,
            }}
            columns={expansesColumns.columns}
            rows={EXPANSES_MOCK}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default NKExpenses;
