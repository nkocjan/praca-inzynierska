import { GridColDef } from "@mui/x-data-grid";
import CategoriesActionMenu from "./CategoriesActionMenu";
import NKStaticLinearProgressBar from "../../../../lib/progressBar/NKStaticLinearProgressBar";

interface CategoriesColumnsProps {
  onRefresh: () => void;
}

const getCategoriesColumns = (props: CategoriesColumnsProps): GridColDef[] => [
  { field: "name", headerName: "Nazwa", flex: 2 },
  {
    field: "weeklyBudget",
    headerName: "Budżet tygodniowy",
    flex: 3,
    renderCell: (params) => (
      <NKStaticLinearProgressBar
        value={params?.value?.spentAmount}
        maxValue={params.value?.amount}
      />
    ),
  },
  {
    field: "monthlyBudget",
    headerName: "Budżet miesięczny",
    flex: 3,
    renderCell: (params) => (
      <NKStaticLinearProgressBar
        value={params.value?.spentAmount}
        maxValue={params.value?.amount}
      />
    ),
  },
  {
    field: "yearlyBudget",
    headerName: "Budżet roczny",
    flex: 3,
    renderCell: (params) => (
      <NKStaticLinearProgressBar
        value={params.value?.spentAmount}
        maxValue={params.value?.amount}
      />
    ),
  },
  {
    field: "actions",
    headerName: "Akcje",
    flex: 1,
    sortable: false,
    filterable: false,
    align: "center",
    renderCell: (params) => (
      <CategoriesActionMenu row={params.row} onRefresh={props.onRefresh} />
    ),
  },
];

export default getCategoriesColumns;
