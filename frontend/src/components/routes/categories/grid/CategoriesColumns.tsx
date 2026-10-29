import { GridColDef } from "@mui/x-data-grid";
import CategoriesActionMenu from "./CategoriesActionMenu";
import NKStaticLinearProgressBar from "../../../../lib/progressBar/NKStaticLinearProgressBar";
import type { TFunction } from "i18next";

interface CategoriesColumnsProps {
  onRefresh: () => void;
  t: TFunction;
}

const getCategoriesColumns = (props: CategoriesColumnsProps): GridColDef[] => [
  { field: "name", headerName: props.t("columns.name"), flex: 2 },
  {
    field: "weeklyBudget",
    headerName: props.t("columns.weeklyBudget"),
    flex: 3,
    renderCell: params => (
      <NKStaticLinearProgressBar
        value={params?.value?.spentAmount}
        maxValue={params.value?.amount}
      />
    ),
  },
  {
    field: "monthlyBudget",
    headerName: props.t("columns.monthlyBudget"),
    flex: 3,
    renderCell: params => (
      <NKStaticLinearProgressBar
        value={params.value?.spentAmount}
        maxValue={params.value?.amount}
      />
    ),
  },
  {
    field: "yearlyBudget",
    headerName: props.t("columns.yearlyBudget"),
    flex: 3,
    renderCell: params => (
      <NKStaticLinearProgressBar
        value={params.value?.spentAmount}
        maxValue={params.value?.amount}
      />
    ),
  },
  {
    field: "actions",
    headerName: props.t("columns.actions"),
    flex: 1,
    sortable: false,
    filterable: false,
    align: "center",
    renderCell: params => (
      <CategoriesActionMenu
        row={params.row}
        onRefresh={props.onRefresh}
      />
    ),
  },
];

export default getCategoriesColumns;
