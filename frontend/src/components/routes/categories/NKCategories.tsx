import Grid from "@mui/material/Grid2";
import NKGrid from "../../../lib/grid/NKGrid";
import { useEffect, useState, useMemo, useCallback } from "react";
import { ICategoryBudgetSummary } from "../../../types/interfaces/ICategory";
import CategoriesFilters from "./grid/CategoriesFilters";
import { NKButton } from "../../../lib/button/Button";
import { useDialog } from "../../../lib/dialog/useDialog";
import AddCategoryForm from "./forms/AddCategoryForm";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { apiClient } from "../../../api/apiClient.ts";
import getCategoriesColumns from "./grid/CategoriesColumns";
import { useTranslation } from "react-i18next";

const NKCategories = () => {
  const { t } = useTranslation("categories");

  const [nameFilter, setNameFilter] = useState("");
  const [hasAdditionalBudgets, setHasAdditionalBudgets] = useState<
    boolean | null
  >(null);
  const [hasExceededBudget, setHasExceededBudget] = useState<boolean | null>(
    null,
  );

  const [rows, setRows] = useState<ICategoryBudgetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "name", sort: "asc" },
  ]);

  const { openDialog, closeDialog } = useDialog();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await apiClient.get<ICategoryBudgetSummary[]>(
          "/api/bff/categories",
        );

        setRows(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
        enqueueSnackbar(t("snackbar.categoriesFetchError"), {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData().then(r => r);
  }, [refreshTrigger, enqueueSnackbar, t]);

  const filteredRows = useMemo(() => {
    return rows.filter((row: ICategoryBudgetSummary) => {
      return (
        (nameFilter === "" ||
          row.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
        (hasAdditionalBudgets === null || row.hasCustomBudgets) &&
        (hasExceededBudget === null ||
          (row.weeklyBudget?.spentAmount !== undefined &&
            row.weeklyBudget.spentAmount < 0) ||
          (row.monthlyBudget?.spentAmount !== undefined &&
            row.monthlyBudget.spentAmount < 0) ||
          (row.yearlyBudget?.spentAmount !== undefined &&
            row.yearlyBudget.spentAmount < 0))
      );
    });
  }, [rows, nameFilter, hasAdditionalBudgets, hasExceededBudget]);

  const columns = getCategoriesColumns({ onRefresh: handleRefresh, t });

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: 3, marginTop: 5 }}>
      <Grid
        container
        size={9}
        sx={{ textAlign: "center" }}>
        <Grid size={4}>
          <NKButton
            title={t("page.addCategory")}
            onClick={() =>
              openDialog(
                {
                  title: t("page.addCategoryTitle"),
                  saveButtonTitle: t("page.create"),
                  cancelButtonTitle: t("page.cancel"),
                  formId: "edit-budget-form",
                },
                <AddCategoryForm
                  formId="edit-budget-form"
                  isEdit={false}
                  onSuccess={() => {
                    closeDialog();
                    handleRefresh();
                  }}
                />,
              )
            }></NKButton>
        </Grid>
        <Grid size={4}>
          <NKButton
            title={t("page.generateReport")}
            onClick={() =>
              enqueueSnackbar(t("snackbar.comingSoon"), { variant: "info" })
            }></NKButton>
        </Grid>
        <Grid size={4}></Grid>
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
            rows={filteredRows}
            loading={loading}
            rowCount={filteredRows.length}
            pagination={true}
            paginationMode="client"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortingMode="client"
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            filters={
              <CategoriesFilters
                nameFilter={nameFilter}
                setNameFilter={setNameFilter}
                hasAdditionalBudgets={hasAdditionalBudgets}
                setHasAdditionalBudgets={setHasAdditionalBudgets}
                hasExceededBudget={hasExceededBudget}
                setHasExceededBudget={setHasExceededBudget}></CategoriesFilters>
            }></NKGrid>
        </Grid>
      </Grid>
      <Grid
        container
        size={3}
        sx={{ textAlign: "center", minHeight: "30vh" }}></Grid>
    </Grid>
  );
};
export default NKCategories;
