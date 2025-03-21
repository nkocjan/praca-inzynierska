import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { mockBudgets } from "../../../assets/mocks/BudgetMock";
import Grid from "@mui/material/Grid2";
import { NKButton } from "../../../lib/button/Button";
import NKGrid from "../../../lib/grid/NKGrid";
import BudgetColumns from "./grid/BudgetColumns";
import BudgetFilters from "./grid/BudgetFilters";
import { IBudget } from "../../../types/interfaces/IBudget";

const NKBudget = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [amountFrom, setAmountFrom] = useState<number | null>(null);
  const [amountTo, setAmountTo] = useState<number | null>(null);
  const [isArchived, setIsArchived] = useState<boolean | null>(null);
  const [isOver, setIsOver] = useState<boolean | null>(null);

  const filteredRows = mockBudgets.filter((row: IBudget) => {
    return (
      (nameFilter === "" ||
        row.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (categoryFilter.length === 0 ||
        categoryFilter.includes(row.category.id)) &&
      (amountFrom === null || row.amount >= amountFrom) &&
      (amountTo === null || row.amount <= amountTo) &&
      (isArchived === null ||
        dayjs().isAfter(dayjs(row.dateTo).subtract(1, "day"))) &&
      (isOver === null || row.spentAmount > row.amount)
    );
  });

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: 3, marginTop: 5 }}>
      <Grid>
        <NKButton title="Dodaj budżet"></NKButton>
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
          columns={BudgetColumns.columns}
          rows={filteredRows}
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
              isOver={isOver}
              setIsOver={setIsOver}
            />
          }></NKGrid>
      </Grid>
    </Grid>
  );
};
export default NKBudget;
