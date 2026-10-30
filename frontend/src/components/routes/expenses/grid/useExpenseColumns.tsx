import { useMemo } from "react";
import { Box } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { ExpenseUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatDate } from "../../../../i18n/locale";
import ExpenseActionMenu from "./ExpenseActionMenu";
import { AmountCell, CategoryLabel, ExpenseStatusChip, NameCell } from "./ExpenseCells";

interface ExpenseColumnsOptions {
  compact: boolean;
  colorFor: (categoryId?: string) => string;
  onChanged: () => void;
}

const useExpenseColumns = ({ compact, colorFor, onChanged }: ExpenseColumnsOptions): GridColDef<ExpenseUiDTO>[] => {
  const { t, i18n } = useTranslation("expenses");
  const language = normalizeLanguage(i18n.language);

  return useMemo(
    () => [
      {
        field: "name",
        headerName: t("columns.name"),
        flex: 2,
        minWidth: compact ? 150 : 240,
        renderCell: ({ row }) => (
          <NameCell
            expense={row}
            color={colorFor(row.category?.id)}
            compact={compact}
          />
        ),
      },
      {
        field: "category",
        headerName: t("columns.category"),
        flex: 1.1,
        minWidth: 150,
        // The backend can only sort by the category's id, which means nothing to the user.
        sortable: false,
        renderCell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <CategoryLabel
              name={row.category?.name}
              color={colorFor(row.category?.id)}
            />
          </Box>
        ),
      },
      {
        field: "date",
        headerName: t("columns.date"),
        flex: 0.9,
        minWidth: 120,
        renderCell: ({ row }) => formatDate(row.date ?? "", language),
      },
      {
        field: "isPlanned",
        headerName: t("columns.status"),
        flex: 0.9,
        minWidth: 140,
        renderCell: ({ row }) => <ExpenseStatusChip planned={Boolean(row.isPlanned)} />,
      },
      {
        field: "amount",
        headerName: t("columns.amount"),
        ...(compact ? { width: 100 } : { flex: 0.9, minWidth: 110 }),
        align: "right",
        headerAlign: "right",
        renderCell: ({ row }) => (
          <AmountCell
            expense={row}
            compact={compact}
          />
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
          <ExpenseActionMenu
            row={row}
            onSuccess={onChanged}
          />
        ),
      },
    ],
    [t, language, compact, colorFor, onChanged],
  );
};

export default useExpenseColumns;
