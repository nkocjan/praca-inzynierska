import { GridColDef } from "@mui/x-data-grid";
import { BudgetTypeEnum } from "../../../../types/enums/BudgetTypeEnum";
import { Chip } from "@mui/material";
import { formatPolishDate } from "../../../../lib/dateUtils.ts";
import type { AppLanguage } from "../../../../i18n/i18n";
import { formatCurrencyPLN } from "../../../../i18n/locale";
import type { TFunction } from "i18next";

const getTypeLabel = (type: BudgetTypeEnum, t: TFunction) => {
  switch (type) {
    case BudgetTypeEnum.WEEK:
      return { label: t("periodType.week"), color: "default" };
    case BudgetTypeEnum.MONTH:
      return { label: t("periodType.month"), color: "success" };
    case BudgetTypeEnum.YEAR:
      return { label: t("periodType.year"), color: "info" };
    case BudgetTypeEnum.CUSTOM:
      return { label: t("periodType.custom"), color: "warning" };
    default:
      return { label: t("periodType.unknown"), color: "error" };
  }
};

const getBudgetColumns = ({
  t,
  language,
}: {
  t: TFunction;
  language: AppLanguage;
}): GridColDef[] => [
  // { field: "name", headerName: "Nazwa", flex: 1 },
  {
    field: "category",
    headerName: t("columns.category"),
    flex: 1,
    renderCell: params => params.value.name,
  },
  {
    field: "amount",
    headerName: t("columns.amount"),
    flex: 1,
    renderCell: params => formatCurrencyPLN(Number(params.value), language),
  },
  {
    field: "periodStart",
    headerName: t("columns.periodStart"),
    flex: 1,
    renderCell: params => formatPolishDate(params.value),
  },
  {
    field: "periodEnd",
    headerName: t("columns.periodEnd"),
    flex: 1,
    renderCell: params => formatPolishDate(params.value),
  },
  {
    field: "period",
    headerName: t("columns.periodType"),
    flex: 1,
    renderCell: params => {
      const { label, color } = getTypeLabel(
        params.value as unknown as BudgetTypeEnum,
        t,
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

export default getBudgetColumns;
