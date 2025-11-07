import { GridColDef } from "@mui/x-data-grid";
import { BudgetTypeEnum } from "../../../../types/enums/BudgetTypeEnum";
import { Chip } from "@mui/material";
import { formatPolishDate } from "../../../../lib/dateUtils.ts";

const getTypelabel = (type: BudgetTypeEnum) => {
  switch (type) {
    case BudgetTypeEnum.WEEK:
      return { label: "Tygodniowy", color: "default" };
    case BudgetTypeEnum.MONTH:
      return { label: "Miesięczny", color: "success" };
    case BudgetTypeEnum.YEAR:
      return { label: "Roczny", color: "info" };
    case BudgetTypeEnum.CUSTOM:
      return { label: "Niestandardowy", color: "warning" };
    default:
      return { label: "Nieznany", color: "error" };
  }
};

const getBudgetColumns = (): GridColDef[] => [
  { field: "name", headerName: "Nazwa", flex: 1 },
  {
    field: "category",
    headerName: "Kategoria",
    flex: 1,
    renderCell: (params) => params.value.name,
  },
  {
    field: "amount",
    headerName: "Kwota",
    flex: 1,
    renderCell: (params) => `${params.value} zł`,
  },
  {
    field: "periodStart",
    headerName: "Od",
    flex: 1,
    renderCell: (params) => formatPolishDate(params.value),
  },
  {
    field: "periodEnd",
    headerName: "Do",
    flex: 1,
    renderCell: (params) => formatPolishDate(params.value),
  },
  {
    field: "period",
    headerName: "Typ",
    flex: 1,
    renderCell: (params) => {
      const { label, color } = getTypelabel(
        params.value as unknown as BudgetTypeEnum,
      );
      return <Chip label={label} color={color as never} variant="outlined" />;
    },
  },
];

export default getBudgetColumns;
