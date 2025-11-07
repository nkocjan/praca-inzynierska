import { Dayjs } from "dayjs";
import { useState, useEffect, useMemo } from "react"; // Importy
import Grid from "@mui/material/Grid2";
import { NKButton } from "../../../lib/button/Button";
import NKGrid from "../../../lib/grid/NKGrid";
import getBudgetColumns from "./grid/BudgetColumns"; // Poprawiony import
import BudgetFilters from "./grid/BudgetFilters";
import { IBudget } from "../../../types/interfaces/IBudget";
import { useSnackbar } from "notistack";
import { useDialog } from "../../../lib/dialog/NKDialogContext.tsx";
import { apiClient } from "../../../api/apiClient.ts";
import { useDebounce } from "../../../hooks/useDebounce.ts"; // Założenie, że hook istnieje
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { BudgetSearchRequestDTO, CategoryDTO } from "../../../api/generated";

const NKBudget = () => {
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
  const [refreshTrigger] = useState(0);

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
  const { openDialog } = useDialog();

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
        enqueueSnackbar("Nie udało się pobrać listy kategorii", {
          variant: "error",
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    void fetchCategories();
  }, [enqueueSnackbar]);

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

      const sortParams = sortModel.map((s) => `${s.field},${s.sort}`).join(",");

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
        enqueueSnackbar("Nie udało się pobrać danych o budżetach", {
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
  ]);

  const columns = useMemo(() => getBudgetColumns(), []);

  return (
    <Grid container spacing={3} sx={{ padding: 3, marginTop: 5 }}>
      <Grid>
        <NKButton
          title="Dodaj budżet"
          onClick={() =>
            openDialog(
              {
                title: "Dodaj nowy budżet",
                saveButtonTitle: "Dodaj",
                cancelButtonTitle: "Anuluj",
                formId: "budget-form",
              },
              <div>Formularz dodawania budżetu (TODO)</div>,
            )
          }
        ></NKButton>
      </Grid>
      <Grid
        size={12}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
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
          }
        ></NKGrid>
      </Grid>
    </Grid>
  );
};
export default NKBudget;
