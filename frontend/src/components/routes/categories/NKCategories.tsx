import Grid from "@mui/material/Grid2";
import NKGrid from "../../../lib/grid/NKGrid";
import CategoriesColumns from "./grid/CategoriesColumns";
import { mockCategoryBudgetSummaries } from "../../../assets/mocks/CategoriesMock";
import { useState } from "react";
import { ICategoryBudgetSummary } from "../../../types/interfaces/ICategory";
import CategoriesFilters from "./grid/CategoriesFilters";
import { NKButton } from "../../../lib/button/Button";
import { useDialog } from "../../../lib/dialog/NKDialogContext";
import AddCategoryForm from "./forms/AddCategoryForm";
import GenerateReportForm from "./forms/GenerateReportForm";

const NKCategories = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [hasAdditionalBudgets, setHasAdditionalBudgets] = useState<
    boolean | null
  >(null);
  const [hasExceededBudget, setHasExceededBudget] = useState<boolean | null>(
    null
  );
  const { openDialog } = useDialog();

  const filteredRows = mockCategoryBudgetSummaries.filter(
    (row: ICategoryBudgetSummary) => {
      return (
        (nameFilter === "" ||
          row.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
        (hasAdditionalBudgets === null || row.hasCustomBudgets === true) &&
        (hasExceededBudget === null ||
          (row.weekBudget?.spentAmount !== undefined &&
            row.weekBudget.spentAmount < 0) ||
          (row.monthBudget?.spentAmount !== undefined &&
            row.monthBudget.spentAmount < 0) ||
          (row.yearBudget?.spentAmount !== undefined &&
            row.yearBudget.spentAmount < 0))
      );
    }
  );

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
            title="Dodaj kategorię"
            onClick={() =>
              openDialog(
                {
                  title: "Dodaj kategorię",
                  saveButtonTitle: "Utwórz",
                  cancelButtonTitle: "Anuluj",
                },
                <AddCategoryForm />
              )
            }></NKButton>
        </Grid>
        <Grid size={4}>
          <NKButton
            title="Generuj raport"
            onClick={() =>
              openDialog(
                {
                  title: "Generuj raport",
                  saveButtonTitle: "Wygeneruj",
                  cancelButtonTitle: "Anuluj",
                },
                <GenerateReportForm />
              )
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
            columns={CategoriesColumns.columns}
            rows={filteredRows}
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
        sx={{ textAlign: "center", minHeight: "30vh" }}>
        <Grid size={12}>wyk1</Grid>
        <Grid size={12}>wyk1</Grid>
      </Grid>
    </Grid>
  );
};
export default NKCategories;
