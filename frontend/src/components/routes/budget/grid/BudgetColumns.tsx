import { GridColDef } from "@mui/x-data-grid";
import { BudgetTypeEnum } from "../../../../types/enums/BudgetTypeEnum";
import { Chip } from "@mui/material";

const getTypelabel = (type: BudgetTypeEnum) => {
  switch (type) {
    case BudgetTypeEnum.WEEK:
      return { label: "Tygodniowy", color: "default" };
    case BudgetTypeEnum.MONTH:
      return { label: "Miesięczny", color: "success" };
    case BudgetTypeEnum.YEAR:
      return { label: "Roczny", color: "info" };
    case BudgetTypeEnum.CUSTOM:
      return { label: "Roczny", color: "warning" };
  }
};

const BudgetsColumns: GridColDef[] = [
  { field: "name", headerName: "Nazwa", flex: 1 },
  {
    field: "category",
    headerName: "Kategoria",
    flex: 1,
    renderCell: params => params.value.name,
  },
  {
    field: "amount",
    headerName: "Kwota",
    flex: 1,
    renderCell: params => `${params.value} zł`,
  },
  {
    field: "spentAmount",
    headerName: "Kwota",
    flex: 1,
    renderCell: params => `${params.value} zł`,
  },
  { field: "dateFrom", headerName: "Od", flex: 1 },
  { field: "dateTo", headerName: "Od", flex: 1 },
  {
    field: "type",
    headerName: "Typ",
    flex: 1,
    renderCell: params => {
      const { label, color } = getTypelabel(
        params.value as unknown as BudgetTypeEnum
      );
      return (
        <Chip
          label={label}
          color={color as never}
          variant="outlined"
        />
      );
    },
  },
];

export default { columns: BudgetsColumns };
