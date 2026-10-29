import { NKButton } from "../../../lib/button/Button.tsx";
import Grid from "@mui/material/Grid2";
import NKGrid from "../../../lib/grid/NKGrid.tsx";
import getExpensesColumns from "./grid/expansesColumns.tsx";
import { useEffect, useRef, useState } from "react";
import ExpensesFilters from "./grid/expenseFilters.tsx";
import { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";
import { useDialog } from "../../../lib/dialog/useDialog";
import AddExpanseForm from "./forms/AddEditExpanseForm.tsx";
import ConfirmDelete from "../../../lib/dialog/templates/ConfirmDelete.tsx";
import { apiClient } from "../../../api/apiClient.ts";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import {
  CategoryDTO,
  ExpenseSearchRequestUiDTO,
  ExpenseUiDTO,
} from "../../../api/generated";
import { useDebounce } from "../../../hooks/useDebounce.ts";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const NKExpenses = () => {
  const { t } = useTranslation("expenses");

  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [amountFrom, setAmountFrom] = useState<number | "">("");
  const [amountTo, setAmountTo] = useState<number | "">("");
  const [isPlanned, setIsPlanned] = useState<boolean | undefined>(undefined);

  const location = useLocation();
  const prefillAppliedRef = useRef(false);

  const [rows, setRows] = useState<ExpenseUiDTO[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const debouncedNameFilter = useDebounce(nameFilter, 500);
  const debouncedAmountFrom = useDebounce(amountFrom, 500);
  const debouncedAmountTo = useDebounce(amountTo, 500);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await apiClient.get<CategoryDTO[]>(
          "/api/bff/categories/combo",
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
        enqueueSnackbar(t("snackbar.categoriesFetchError"), {
          variant: "error",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    void fetchCategories();
  }, [enqueueSnackbar, t]);

  useEffect(() => {
    const state = location.state as
      | { prefillCategoryIds?: string[] }
      | undefined;
    if (prefillAppliedRef.current) return;
    if (!state?.prefillCategoryIds?.length) return;
    setCategoryFilter(state.prefillCategoryIds);
    setPaginationModel(prev => ({ ...prev, page: 0 }));
    prefillAppliedRef.current = true;
  }, [location.state]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "date", sort: "desc" },
  ]);

  const { openDialog, closeDialog } = useDialog();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const requestBody: ExpenseSearchRequestUiDTO = {
        name: debouncedNameFilter || undefined,
        categoryIds: categoryFilter.length > 0 ? categoryFilter : undefined,
        dateFrom: dateFrom ? dateFrom.startOf("day").toISOString() : undefined,
        dateTo: dateTo ? dateTo.endOf("day").toISOString() : undefined,
        amountFrom:
          debouncedAmountFrom === "" ? undefined : debouncedAmountFrom,
        amountTo: debouncedAmountTo === "" ? undefined : debouncedAmountTo,
        isPlanned: isPlanned,
        description: undefined,
      };

      const sortParams = sortModel.map(s => `${s.field},${s.sort}`).join(",");

      try {
        const response = await apiClient.post(
          "/api/bff/expenses/search",
          requestBody,
          {
            params: {
              page: paginationModel.page,
              size: paginationModel.pageSize,
              sort: sortParams || "date,desc",
            },
          },
        );

        setRows(response.data.content);
        setRowCount(response.data.totalElements);
      } catch (error) {
        console.error("Błąd podczas pobierania wydatków:", error);
        enqueueSnackbar(t("snackbar.expensesFetchError"), {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [
    debouncedNameFilter,
    debouncedAmountFrom,
    debouncedAmountTo,
    categoryFilter,
    dateFrom,
    dateTo,
    isPlanned,
    paginationModel,
    sortModel,
    refreshTrigger,
    enqueueSnackbar,
    t,
  ]);

  const handleFormSuccess = () => {
    closeDialog();
    setRefreshTrigger(prev => prev + 1);
  };

  const columns = getExpensesColumns(handleFormSuccess);

  const handleDelete = (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;
    const formId = "delete-expenses-form";
    openDialog(
      {
        title: t("delete.bulkTitle"),
        saveButtonTitle: t("delete.saveBulk"),
        cancelButtonTitle: t("page.cancel"),
        formId,
      },
      <ConfirmDelete
        translation={t("delete.expensesAcc")}
        formId={formId}
        onConfirm={async () => {
          const results = await Promise.allSettled(
            selectedIds.map(id => apiClient.delete(`/api/bff/expenses/${id}`)),
          );
          const successCount = results.filter(
            r => r.status === "fulfilled",
          ).length;
          const failCount = results.length - successCount;

          if (successCount > 0) {
            enqueueSnackbar(
              t("snackbar.bulkDeleteSuccess", { count: successCount }),
              {
                variant: "success",
              },
            );
          }
          if (failCount > 0) {
            enqueueSnackbar(
              t("snackbar.bulkDeleteError", { count: failCount }),
              {
                variant: "error",
              },
            );
            throw new Error("Nie wszystkie wydatki zostały usunięte");
          }
        }}
        onSuccess={handleFormSuccess}></ConfirmDelete>,
    );
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: 3, marginTop: 5 }}>
      <Grid>
        <NKButton
          title={t("page.addExpense")}
          onClick={() =>
            openDialog(
              {
                title: t("page.addNewExpenseTitle"),
                saveButtonTitle: t("page.add"),
                cancelButtonTitle: t("page.cancel"),
                formId: "expense-form",
              },
              <AddExpanseForm
                formId="expense-form"
                onSuccess={handleFormSuccess}
              />,
            )
          }></NKButton>
      </Grid>
      <Grid>
        {/* <NKButton
          title={t("page.loadFromFile")}
          onClick={() =>
            enqueueSnackbar(t("snackbar.comingSoon"), { variant: "info" })
          }
        ></NKButton> */}
      </Grid>

      <Grid
        size={12}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <NKGrid
          sx={{
            minHeight: 300,
            height: "auto",
            maxHeight: "73vh",
            flexGrow: 1,
          }}
          columns={columns}
          rows={rows}
          rowCount={rowCount}
          loading={loading}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onDelete={handleDelete}
          isCheckboxOn={true}
          filters={
            <ExpensesFilters
              nameFilter={nameFilter}
              setNameFilter={setNameFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              amountFrom={amountFrom}
              setAmountFrom={setAmountFrom}
              amountTo={amountTo}
              setAmountTo={setAmountTo}
              isPlanned={isPlanned}
              setIsPlanned={setIsPlanned}
              categories={categories}
              categoriesLoading={loadingCategories}
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export default NKExpenses;
