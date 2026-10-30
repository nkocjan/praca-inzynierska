import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { DataGrid, GridPaginationModel, GridRowSelectionModel, GridSortModel } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { apiClient } from "../../../api/apiClient.ts";
import { CategoryDTO, ExpenseUiDTO } from "../../../api/generated";
import { useDebounce } from "../../../hooks/useDebounce.ts";
import { normalizeLanguage } from "../../../i18n/i18n";
import ConfirmDelete from "../../../lib/dialog/templates/ConfirmDelete.tsx";
import { useDialog } from "../../../lib/dialog/useDialog";
import { useCategoryColors } from "../../../theme/chartColors";
import { EMPTY_FILTERS, ExpenseFilterState, hasActiveFilters, toSearchRequest } from "./expenseFilters";
import AddExpanseForm from "./forms/AddEditExpanseForm.tsx";
import ExpenseFiltersBar from "./grid/ExpenseFiltersBar";
import ExpensesEmptyState from "./grid/ExpensesEmptyState";
import SelectionBar from "./grid/SelectionBar";
import useExpenseColumns from "./grid/useExpenseColumns";

const NKExpenses = () => {
  const { t, i18n } = useTranslation("expenses");
  const language = normalizeLanguage(i18n.language);
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();
  const location = useLocation();

  // The categories and budgets pages link here with their category (and the budget's period) already selected.
  const [filters, setFilters] = useState<ExpenseFilterState>(() => {
    const state = location.state as { prefillCategoryIds?: string[]; prefillPeriod?: { from?: string; to?: string } } | null;
    const period = state?.prefillPeriod;
    return {
      ...EMPTY_FILTERS,
      categoryIds: state?.prefillCategoryIds ?? [],
      ...(period?.from && period.to ? { period: "custom", dateFrom: dayjs(period.from), dateTo: dayjs(period.to) } : {}),
    };
  });
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [rows, setRows] = useState<ExpenseUiDTO[]>([]);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "date", sort: "desc" }]);

  const { colorFor } = useCategoryColors(categories, language);

  const debouncedName = useDebounce(filters.name, 400);
  const debouncedAmountFrom = useDebounce(filters.amountFrom, 400);
  const debouncedAmountTo = useDebounce(filters.amountTo, 400);

  const { categoryIds, status, period, dateFrom, dateTo } = filters;
  // Text fields go through the debounced copies, everything else applies at once.
  const request = useMemo(
    () =>
      toSearchRequest({
        name: debouncedName,
        amountFrom: debouncedAmountFrom,
        amountTo: debouncedAmountTo,
        categoryIds,
        status,
        period,
        dateFrom,
        dateTo,
      }),
    [debouncedName, debouncedAmountFrom, debouncedAmountTo, categoryIds, status, period, dateFrom, dateTo],
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
    const sort = sortModel[0] ? `${sortModel[0].field},${sortModel[0].sort}` : "date,desc";

    apiClient
      .post<{ content: ExpenseUiDTO[]; totalElements: number }>("/api/bff/expenses/search", request, {
        params: { page: paginationModel.page, size: paginationModel.pageSize, sort },
      })
      .then(response => {
        if (ignore) return;
        setRows(response.data.content);
        setRowCount(response.data.totalElements);
      })
      .catch(error => {
        if (ignore) return;
        console.error("Błąd podczas pobierania wydatków:", error);
        enqueueSnackbar(t("snackbar.expensesFetchError"), { variant: "error" });
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

  const changeFilters = (patch: Partial<ExpenseFilterState>) => {
    setFilters(previous => ({ ...previous, ...patch }));
    setPaginationModel(previous => ({ ...previous, page: 0 }));
    setSelection([]);
  };

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPaginationModel(previous => ({ ...previous, page: 0 }));
    setSelection([]);
  }, []);

  const columns = useExpenseColumns({ compact, colorFor, onChanged: refresh });

  const openAddExpense = () =>
    openDialog(
      {
        title: t("page.addNewExpenseTitle"),
        saveButtonTitle: t("page.add"),
        cancelButtonTitle: t("page.cancel"),
        formId: "expense-form",
        maxWidth: "sm",
      },
      <AddExpanseForm
        formId="expense-form"
        onSuccess={() => {
          closeDialog();
          refresh();
        }}
      />,
    );

  const deleteSelected = () => {
    const ids = selection.map(String);
    const formId = "delete-expenses-form";
    openDialog(
      {
        title: t("delete.bulkTitle", { count: ids.length }),
        saveButtonTitle: t("delete.confirm"),
        cancelButtonTitle: t("page.cancel"),
        formId,
        destructive: true,
      },
      <ConfirmDelete
        message={t("delete.bulkText")}
        hint={t("delete.cannotUndo")}
        formId={formId}
        onConfirm={async () => {
          const results = await Promise.allSettled(ids.map(id => apiClient.delete(`/api/bff/expenses/${id}`)));
          const deleted = results.filter(result => result.status === "fulfilled").length;
          const failed = results.length - deleted;
          if (deleted > 0) {
            enqueueSnackbar(t("snackbar.bulkDeleteSuccess", { count: deleted }), { variant: "success" });
          }
          if (failed > 0) {
            enqueueSnackbar(t("snackbar.bulkDeleteError", { count: failed }), { variant: "error" });
            refresh();
            throw new Error("Nie wszystkie wydatki zostały usunięte");
          }
        }}
        onSuccess={() => {
          closeDialog();
          setSelection([]);
          refresh();
        }}
      />,
    );
  };

  const filtered = hasActiveFilters(filters);

  return (
    <Box sx={{ pb: selection.length > 0 ? 10 : 0 }}>
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
          onClick={openAddExpense}>
          {t("page.addExpense")}
        </Button>
      </Stack>

      <Card sx={{ overflow: "hidden" }}>
        <ExpenseFiltersBar
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
          columnVisibilityModel={compact ? { category: false, date: false, isPlanned: false } : {}}
          checkboxSelection={!compact}
          disableRowSelectionOnClick
          keepNonExistentRowsSelected
          rowSelectionModel={selection}
          onRowSelectionModelChange={setSelection}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          sortingMode="server"
          sortingOrder={["desc", "asc"]}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableColumnMenu
          slots={{ noRowsOverlay: ExpensesEmptyState }}
          slotProps={{
            noRowsOverlay: { filtered, onReset: resetFilters },
            loadingOverlay: { variant: "skeleton", noRowsVariant: "skeleton" },
          }}
          sx={{
            border: 0,
            borderRadius: 0,
            borderTop: 1,
            borderColor: "divider",
            "--DataGrid-overlayHeight": "320px",
          }}
        />
      </Card>

      <SelectionBar
        count={selection.length}
        onClear={() => setSelection([])}
        onDelete={deleteSelected}
      />
    </Box>
  );
};

export default NKExpenses;
