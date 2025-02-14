import { GridColDef } from "@mui/x-data-grid";

const expansesColumns: GridColDef<[number]>[] = [
  { field: "name", headerName: "Nazwa", flex: 3 },
  { field: "category", headerName: "Kategoria", flex: 2 },
  { field: "amount", headerName: "Kwota", flex: 1 },
  { field: "date", headerName: "Data", flex: 2 },
  { field: "planned", headerName: "Czy planowany", flex: 1 },
];

export default { columns: expansesColumns };
