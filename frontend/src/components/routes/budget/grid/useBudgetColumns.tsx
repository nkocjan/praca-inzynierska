import { useMemo } from "react";
import { Box } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { BudgetUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatBudgetPeriod } from "../../../../lib/budgetPeriod";
import BudgetUsage from "../../../../lib/budgetUsage/BudgetUsage";
import BudgetActionMenu from "./BudgetActionMenu";
import { BudgetCategoryCell, BudgetPeriodCell } from "./BudgetCells";

interface BudgetColumnsOptions {
  compact: boolean;
  colorFor: (categoryId?: string) => string;
  onChanged: () => void;
  showEnded: boolean;
}

const useBudgetColumns = ({ compact, colorFor, onChanged, showEnded }: BudgetColumnsOptions): GridColDef<BudgetUiDTO>[] => {
  const { t, i18n } = useTranslation("budgets");
  const language = normalizeLanguage(i18n.language);

  return useMemo(
    () => [
      {
        field: "category",
        headerName: t("columns.category"),
        flex: 1.5,
        minWidth: compact ? 150 : 200,
        sortingOrder: ["asc", "desc"],
        renderCell: ({ row }) => (
          <BudgetCategoryCell
            budget={row}
            color={colorFor(row.category?.id)}
            compact={compact}
            showEnded={showEnded}
          />
        ),
      },
      {
        field: "periodStart",
        headerName: t("columns.period"),
        flex: 1.3,
        minWidth: 200,
        renderCell: ({ row }) => (
          <BudgetPeriodCell
            budget={row}
            showEnded={showEnded}
          />
        ),
      },
      {
        field: "spentAmount",
        headerName: t("columns.spent"),
        flex: compact ? 1.5 : 1.6,
        minWidth: compact ? 130 : 220,
        // Computed per page by the BFF, so the server cannot sort by it.
        sortable: false,
        renderCell: ({ row }) => (
          <BudgetUsage
            spent={Number(row.spentAmount ?? 0)}
            limit={Number(row.amount ?? 0)}
            label={`${row.category?.name}, ${formatBudgetPeriod(row.period, row.periodStart, row.periodEnd, language)}`}
            showLimit
            dense={compact}
          />
        ),
      },
      {
        field: "actions",
        headerName: t("columns.actions"),
        width: compact ? 40 : 64,
        // The grid's default minimum is 50; phones need those pixels for the amounts.
        minWidth: 40,
        sortable: false,
        filterable: false,
        align: "center",
        renderHeader: () => <Box sx={visuallyHidden}>{t("columns.actions")}</Box>,
        renderCell: ({ row }) => (
          <BudgetActionMenu
            row={row}
            color={colorFor(row.category?.id)}
            onSuccess={onChanged}
          />
        ),
      },
    ],
    [t, language, compact, colorFor, onChanged, showEnded],
  );
};

export default useBudgetColumns;
