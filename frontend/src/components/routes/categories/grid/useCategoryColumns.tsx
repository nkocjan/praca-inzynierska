import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { CategoryUiDTO } from "../../../../api/generated";
import BudgetUsage from "../../../../lib/budgetUsage/BudgetUsage";
import CategoryAvatar from "../../../../lib/category/CategoryAvatar";
import { CATEGORY_PERIODS, CategoryPeriod, periodPercent } from "../categoryFilters";
import CategoryActionMenu from "./CategoryActionMenu";

interface CategoryColumnsOptions {
  compact: boolean;
  colorFor: (categoryId?: string) => string;
  onChanged: () => void;
}

const useCategoryColumns = ({ compact, colorFor, onChanged }: CategoryColumnsOptions): GridColDef<CategoryUiDTO>[] => {
  const { t } = useTranslation("categories");

  return useMemo(
    () => [
      {
        field: "name",
        headerName: t("columns.name"),
        flex: 1.4,
        minWidth: compact ? 140 : 220,
        sortingOrder: ["asc", "desc"],
        renderCell: ({ row }) => (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ height: "100%", minWidth: 0 }}>
            <CategoryAvatar
              name={row.name}
              color={colorFor(row.id)}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600 }}
                noWrap>
                {row.name}
              </Typography>
              {row.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="p"
                  noWrap>
                  {row.description}
                </Typography>
              )}
            </Box>
          </Stack>
        ),
      },
      // One column per running period; sorting goes by how much of the limit is used.
      ...CATEGORY_PERIODS.map(
        (period: CategoryPeriod): GridColDef<CategoryUiDTO> => ({
          field: period,
          headerName: t(`columns.${period}`),
          flex: 1,
          minWidth: compact ? 140 : 180,
          sortingOrder: ["desc", "asc"],
          valueGetter: (_value, row) => periodPercent(row, period),
          renderCell: ({ row }) => (
            <BudgetUsage
              spent={Number(row[period]?.spentAmount ?? 0)}
              limit={Number(row[period]?.amount ?? 0)}
              label={`${row.name}, ${t(`columns.${period}`).toLowerCase()}`}
              showLimit
            />
          ),
        }),
      ),
      {
        field: "actions",
        headerName: t("columns.actions"),
        width: compact ? 48 : 64,
        sortable: false,
        filterable: false,
        align: "center",
        renderHeader: () => <Box sx={visuallyHidden}>{t("columns.actions")}</Box>,
        renderCell: ({ row }) => (
          <CategoryActionMenu
            row={row}
            onSuccess={onChanged}
          />
        ),
      },
    ],
    [t, compact, colorFor, onChanged],
  );
};

export default useCategoryColumns;
