import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import CategoriesActionMenu from "./CategoriesActionMenu";
import NKStaticLinearProgressBar from "../../../../lib/progressBar/NKStaticLinearProgressBar";

const CategoriesColumns: GridColDef[] = [
  { field: "name", headerName: "Nazwa", flex: 2 },
  {
    field: "weekBudget",
    headerName: "Budżet tygodniowy",
    flex: 3,
    renderCell: params => (
      <NKStaticLinearProgressBar
        value={params.value.spentAmount}
        maxValue={params.value.amount}
      />
    ),
  },
  {
    field: "monthBudget",
    headerName: "Budżet miesięczny",
    flex: 3,
    renderCell: params => (
      <NKStaticLinearProgressBar
        value={params.value.spentAmount}
        maxValue={params.value.amount}
      />
    ),
  },
  {
    field: "yearBudget",
    headerName: "Budżet roczny",
    flex: 3,
    renderCell: params => (
      <NKStaticLinearProgressBar
        value={params.value.spentAmount}
        maxValue={params.value.amount}
      />
    ),
  },
  {
    field: "hasCustomBudgets",
    headerName: "Dodatkowe budżety?",
    flex: 2,
    renderCell: params =>
      params.value ? (
        <Chip
          label={"Tak"}
          color={"success"}
          variant="outlined"
        />
      ) : (
        <Chip
          label={"Nie"}
          color={"warning"}
          variant="outlined"
        />
      ),
  },
  {
    field: "actions",
    headerName: "Akcje",
    flex: 0.3,
    sortable: false,
    filterable: false,
    align: "center",
    renderCell: params => <CategoriesActionMenu row={params.row} />,
  },
];

export default { columns: CategoriesColumns };
