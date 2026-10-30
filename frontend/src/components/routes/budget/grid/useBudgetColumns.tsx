import { useMemo } from "react";
import { Box } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { BudgetUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatCurrencyPLN } from "../../../../i18n/locale";
import { budgetTiming, formatBudgetPeriod } from "../../../../lib/budgetPeriod";
import BudgetUsage from "../../../../lib/budgetUsage/BudgetUsage";
import BudgetActionMenu from "./BudgetActionMenu";
import { BudgetCategoryCell, BudgetPeriodCell, BudgetTimingChip } from "./BudgetCells";

interface BudgetColumnsOptions {
  compact: boolean;
  colorFor: (categoryId?: string) => string;
  onChanged: () => void;
}

const useBudgetColumns = ({ compact, colorFor, onChanged }: BudgetColumnsOptions): GridColDef<BudgetUiDTO>[] => {
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
          />
        ),
      },
      {
        field: "periodStart",
        headerName: t("columns.period"),
        flex: 1.2,
        minWidth: 170,
        renderCell: ({ row }) => <BudgetPeriodCell budget={row} />,
      },
      {
        field: "amount",
        headerName: t("columns.amount"),
        flex: 0.8,
        minWidth: 110,
        align: "right",
        headerAlign: "right",
        renderCell: ({ row }) => {
          const amount = Number(row.amount ?? 0);
          return (
            <Box
              component="span"
              sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {formatCurrencyPLN(amount, language, Number.isInteger(amount) ? 0 : 2)}
            </Box>
          );
        },
      },
      {
        field: "spentAmount",
        headerName: t("columns.spent"),
        flex: 1.4,
        minWidth: compact ? 130 : 190,
        // Computed per page by the BFF, so the server cannot sort by it.
        sortable: false,
        renderCell: ({ row }) => (
          <BudgetUsage
            spent={Number(row.spentAmount ?? 0)}
            limit={Number(row.amount ?? 0)}
            label={`${row.category?.name}, ${formatBudgetPeriod(row.period, row.periodStart, row.periodEnd, language)}`}
            showLimit={compact}
          />
        ),
      },
      {
        field: "timing",
        headerName: t("columns.status"),
        flex: 0.8,
        minWidth: 140,
        sortable: false,
        renderCell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <BudgetTimingChip timing={budgetTiming(row.periodStart, row.periodEnd)} />
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: t("columns.actions"),
        width: compact ? 48 : 64,
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
    [t, language, compact, colorFor, onChanged],
  );
};

export default useBudgetColumns;
