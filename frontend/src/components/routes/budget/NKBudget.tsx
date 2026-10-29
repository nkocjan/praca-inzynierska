import { Dayjs } from "dayjs";
import { useState, useEffect, useRef } from "react"; // Importy
import Grid from "@mui/material/Grid2";
import { NKButton } from "../../../lib/button/Button";
import NKGrid from "../../../lib/grid/NKGrid";
import getBudgetColumns from "./grid/BudgetColumns"; // Poprawiony import
import BudgetFilters from "./grid/BudgetFilters";
import { IBudget } from "../../../types/interfaces/IBudget";
import { useSnackbar } from "notistack";
import { useDialog } from "../../../lib/dialog/useDialog";
import { apiClient } from "../../../api/apiClient.ts";
import { useDebounce } from "../../../hooks/useDebounce.ts"; // Założenie, że hook istnieje
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { BudgetSearchRequestDTO, CategoryDTO } from "../../../api/generated";
import { useTranslation } from "react-i18next";
import i18n, { normalizeLanguage } from "../../../i18n/i18n";
import AddBudgetForm from "./forms/AddBudgetForm";
import { useLocation } from "react-router-dom";

const NKBudget = () => {
  const { t } = useTranslation("budgets");
  const language = normalizeLanguage(i18n.language);

  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [amountFrom, setAmountFrom] = useState<number | null>(null);
  const [amountTo, setAmountTo] = useState<number | null>(null);
  const [isArchived, setIsArchived] = useState<boolean | null>(null);
  const [periodTypeFilter, setPeriodTypeFilter] = useState<string | null>(null);

  const [rows, setRows] = useState<IBudget[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "periodStart", sort: "desc" },
  ]);

  const { enqueueSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();
  const location = useLocation();
  const prefillAppliedRef = useRef(false);

  useEffect(() => {
    const state = location.state as
      | { prefillCategoryIds?: string[] }
      | undefined;
    if (prefillAppliedRef.current) return;
    if (!state?.prefillCategoryIds?.length) return;
    setCategoryFilter(state.prefillCategoryIds);
    prefillAppliedRef.current = true;
  }, [location.state]);

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
    const fetchData = async () => {
      setLoading(true);

      const requestBody: BudgetSearchRequestDTO = {
        name: debouncedNameFilter || undefined,
        categoryIds: categoryFilter.length > 0 ? categoryFilter : undefined,
        periodDateFrom: dateFrom
          ? dateFrom.startOf("day").toISOString()
          : undefined,
        periodDateTo: dateTo ? dateTo.endOf("day").toISOString() : undefined,
        amountFrom:
          debouncedAmountFrom === null ? undefined : debouncedAmountFrom,
        amountTo: debouncedAmountTo === null ? undefined : debouncedAmountTo,
        isArchived: isArchived === null ? undefined : isArchived,
        periodType: periodTypeFilter || undefined,
      };

      const sortParams = sortModel.map(s => `${s.field},${s.sort}`).join(",");

      try {
        const response = await apiClient.post(
          "/api/bff/budgets/search",
          requestBody,
          {
            params: {
              page: paginationModel.page,
              size: paginationModel.pageSize,
              sort: sortParams || "periodStart,desc",
            },
          },
        );

        setRows(response.data.content);
        setRowCount(response.data.totalElements);
      } catch (error) {
        console.error("Błąd podczas pobierania budżetów:", error);
        enqueueSnackbar(t("snackbar.budgetsFetchError"), {
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
    isArchived,
    periodTypeFilter,
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

  const columns = getBudgetColumns({ t, language });

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: 3, marginTop: 5 }}>
      <Grid>
        <NKButton
          title={t("page.addBudget")}
          onClick={() => {
            const formId = "budget-form";
            openDialog(
              {
                title: t("page.addNewBudgetTitle"),
                saveButtonTitle: t("page.add"),
                cancelButtonTitle: t("page.cancel"),
                formId,
              },
              <AddBudgetForm
                formId={formId}
                onSuccess={handleFormSuccess}
              />,
            );
          }}></NKButton>
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
          isCheckboxOn={false}
          filters={
            <BudgetFilters
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
              isArchived={isArchived}
              setIsArchived={setIsArchived}
              periodTypeFilter={periodTypeFilter}
              setPeriodTypeFilter={setPeriodTypeFilter}
              categories={categories}
              categoriesLoading={loadingCategories}
            />
          }></NKGrid>
      </Grid>
    </Grid>
  );
};
export default NKBudget;
