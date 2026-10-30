import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { DataGrid, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { apiClient } from "../../../api/apiClient.ts";
import { BudgetUiDTO, CategoryDTO } from "../../../api/generated";
import { useDebounce } from "../../../hooks/useDebounce.ts";
import { normalizeLanguage } from "../../../i18n/i18n";
import { useDialog } from "../../../lib/dialog/useDialog";
import { useCategoryColors } from "../../../theme/chartColors";
import { BudgetFilterState, EMPTY_FILTERS, hasActiveFilters, toSearchRequest } from "./budgetFilters";
import AddBudgetForm from "./forms/AddBudgetForm";
import BudgetFiltersBar from "./grid/BudgetFiltersBar";
import BudgetsEmptyState from "./grid/BudgetsEmptyState";
import useBudgetColumns from "./grid/useBudgetColumns";

// The grid sorts by its column fields; the backend needs the category's name, not the relation.
const SORT_FIELDS: Record<string, string> = { category: "category.name" };
// Many budgets share a start date, so ties are broken in a fixed order to keep pages stable.
const TIE_BREAKERS = [
  ["periodStart", "desc"],
  ["category.name", "asc"],
  ["period", "asc"],
];

const sortParams = (sortModel: GridSortModel) => {
  const primary = sortModel[0] ? [SORT_FIELDS[sortModel[0].field] ?? sortModel[0].field, sortModel[0].sort ?? "asc"] : [];
  const orders = [primary, ...TIE_BREAKERS.filter(([field]) => field !== primary[0])].filter(order => order.length > 0);
  return orders.map(([field, direction]) => ["sort", `${field},${direction}`]);
};

const NKBudget = () => {
  const { t, i18n } = useTranslation("budgets");
  const language = normalizeLanguage(i18n.language);
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();
  const location = useLocation();

  // "Budget history" on the categories page links here with that category selected and every period shown.
  const [filters, setFilters] = useState<BudgetFilterState>(() => {
    const state = location.state as { prefillCategoryIds?: string[] } | null;
    return state?.prefillCategoryIds?.length
      ? { ...EMPTY_FILTERS, status: "all", categoryIds: state.prefillCategoryIds }
      : EMPTY_FILTERS;
  });
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [rows, setRows] = useState<BudgetUiDTO[]>([]);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "periodStart", sort: "desc" }]);

  const { colorFor } = useCategoryColors(categories, language);

  const debouncedAmountFrom = useDebounce(filters.amountFrom, 400);
  const debouncedAmountTo = useDebounce(filters.amountTo, 400);

  const { status, categoryIds, periodType, dateFrom, dateTo } = filters;
  // Amounts go through the debounced copies, everything else applies at once.
  const request = useMemo(
    () =>
      toSearchRequest({
        status,
        categoryIds,
        periodType,
        dateFrom,
        dateTo,
        amountFrom: debouncedAmountFrom,
        amountTo: debouncedAmountTo,
      }),
    [status, categoryIds, periodType, dateFrom, dateTo, debouncedAmountFrom, debouncedAmountTo],
  );

  useEffect(() => {
    apiClient
      .get<CategoryDTO[]>("/api/bff/categories/combo")
      .then(response => setCategories(response.data))
      .catch(error => {
        console.error("Błąd podczas pobierania kategorii:", error);
        enqueueSnackbar(t("snackbar.categoriesFetchError"), { variant: "error" });
      })
      .finally(() => setCategoriesLoading(false));
  }, [enqueueSnackbar, t]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    // URLSearchParams repeats "sort" as Spring expects; a plain array would be sent as "sort[]".
    const params = new URLSearchParams([
      ["page", String(paginationModel.page)],
      ["size", String(paginationModel.pageSize)],
      ...sortParams(sortModel),
    ]);

    apiClient
      .post<{ content: BudgetUiDTO[]; totalElements: number }>("/api/bff/budgets/search", request, { params })
      .then(response => {
        if (ignore) return;
        setRows(response.data.content);
        setRowCount(response.data.totalElements);
      })
      .catch(error => {
        if (ignore) return;
        console.error("Błąd podczas pobierania budżetów:", error);
        enqueueSnackbar(t("snackbar.budgetsFetchError"), { variant: "error" });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    // A slower, older response must not overwrite the result of newer filters.
    return () => {
      ignore = true;
    };
  }, [request, paginationModel, sortModel, refreshTrigger, enqueueSnackbar, t]);

  const refresh = useCallback(() => setRefreshTrigger(value => value + 1), []);

  const changeFilters = (patch: Partial<BudgetFilterState>) => {
    setFilters(previous => ({ ...previous, ...patch }));
    setPaginationModel(previous => ({ ...previous, page: 0 }));
  };

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPaginationModel(previous => ({ ...previous, page: 0 }));
  }, []);

  const columns = useBudgetColumns({ compact, colorFor, onChanged: refresh, showEnded: filters.status !== "ended" });

  const openAddBudget = () => {
    const formId = "budget-form";
    openDialog(
      {
        title: t("page.addBudgetTitle"),
        saveButtonTitle: t("page.add"),
        cancelButtonTitle: t("page.cancel"),
        formId,
        maxWidth: "sm",
      },
      <AddBudgetForm
        formId={formId}
        categoryId={filters.categoryIds.length === 1 ? filters.categoryIds[0] : undefined}
        onSuccess={() => {
          closeDialog();
          refresh();
        }}
      />,
    );
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}>
        <Box>
          <Typography
            variant="h4"
            component="h2">
            {t("page.heading")}
          </Typography>
          <Typography color="text.secondary">{t("page.subtitle")}</Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddRoundedIcon />}
          onClick={openAddBudget}>
          {t("page.addBudget")}
        </Button>
      </Stack>

      <Card sx={{ overflow: "hidden" }}>
        <BudgetFiltersBar
          filters={filters}
          onChange={changeFilters}
          onReset={resetFilters}
          categories={categories}
          categoriesLoading={categoriesLoading}
          colorFor={colorFor}
          resultCount={rowCount}
        />
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          rowCount={rowCount ?? 0}
          loading={loading}
          rowHeight={64}
          columnHeaderHeight={44}
          columnVisibilityModel={compact ? { periodStart: false } : {}}
          disableRowSelectionOnClick
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          sortingMode="server"
          sortingOrder={["desc", "asc"]}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableColumnMenu
          slots={{ noRowsOverlay: BudgetsEmptyState }}
          slotProps={{
            noRowsOverlay: { filtered: hasActiveFilters(filters), onReset: resetFilters },
            loadingOverlay: { variant: "skeleton", noRowsVariant: "skeleton" },
          }}
          sx={{
            border: 0,
            borderRadius: 0,
            borderTop: 1,
            borderColor: "divider",
            "--DataGrid-overlayHeight": "320px",
            // Without a checkbox column the first column lines up with the filters above.
            "& .MuiDataGrid-columnHeader[aria-colindex='1'], & .MuiDataGrid-cell[aria-colindex='1']": {
              pl: { xs: 2, sm: 2.5 },
            },
          }}
        />
      </Card>
    </Box>
  );
};

export default NKBudget;
