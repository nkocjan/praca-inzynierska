import { NKButton } from "../../../lib/button/Button.tsx";
import Grid from "@mui/material/Grid2";
import NKGrid from "../../../lib/grid/NKGrid.tsx";
import getExpensesColumns from "./grid/expansesColumns.tsx";
import { useEffect, useState } from "react";
import ExpensesFilters from "./grid/expenseFilters.tsx";
import { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";
import { useDialog } from "../../../lib/dialog/NKDialogContext.tsx";
import AddExpanseForm from "./forms/AddEditExpanseForm.tsx";
import ConfirmDelete from "../../../lib/dialog/templates/ConfirmDelete.tsx";
import { IExpanse } from "../../../types/interfaces/IExpanse.tsx";
import { apiClient } from "../../../api/apiClient.ts";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { CategoryDTO, ExpenseSearchRequestUiDTO } from "../../../api/generated";
import { useDebounce } from "../../../hooks/useDebounce.ts";

const NKExpenses = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [amountFrom, setAmountFrom] = useState<number | "">("");
  const [amountTo, setAmountTo] = useState<number | "">("");
  const [isPlanned, setIsPlanned] = useState<boolean | undefined>(undefined);

  const [rows, setRows] = useState<IExpanse[]>([]);
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
        enqueueSnackbar("Nie udało się pobrać listy kategorii", {
          variant: "error",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    void fetchCategories();
  }, [enqueueSnackbar]);

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

      const sortParams = sortModel.map((s) => `${s.field},${s.sort}`).join(",");

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
        enqueueSnackbar("Nie udało się pobrać danych o wydatkach", {
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
  ]);

  const handleFormSuccess = () => {
    closeDialog();
    setRefreshTrigger((prev) => prev + 1);
  };

  const columns = getExpensesColumns(handleFormSuccess);

  const handleDelete = (selectedIds: string[]) => {
    console.log(selectedIds);
    openDialog(
      {
        title: "Usuń wiele wydatków",
        saveButtonTitle: "Potwierdź usunięcie",
        cancelButtonTitle: "Anuluj",
      },
      <ConfirmDelete translation="wydatków"></ConfirmDelete>,
    );
  };

  return (
    <Grid container spacing={3} sx={{ padding: 3, marginTop: 5 }}>
      <Grid>
        <NKButton
          title="Dodaj wydatek"
          onClick={() =>
            openDialog(
              {
                title: "Dodaj nowy wydatek",
                saveButtonTitle: "Dodaj",
                cancelButtonTitle: "Anuluj",
                formId: "expense-form",
              },
              <AddExpanseForm
                formId="expense-form"
                onSuccess={handleFormSuccess}
              />,
            )
          }
        ></NKButton>
      </Grid>
      <Grid>
        <NKButton
          title="Wczytaj wydatek z pliku"
          onClick={() =>
            enqueueSnackbar("Funkcjonalność wkrótce!", { variant: "info" })
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
