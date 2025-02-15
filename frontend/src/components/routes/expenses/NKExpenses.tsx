import { NKButton } from "../../../lib/button/Button.tsx";
import Grid from "@mui/material/Grid2";
import NKGrid from "../../../lib/grid/NKGrid.tsx";
import expansesColumns from "./expansesColumns.tsx";
import { EXPANSES_MOCK } from "../../../assets/mocks/ExpansesMock.ts";
import { useState } from "react";
import ExpensesFilters from "./expenseFilters.tsx";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useDialog } from "../../../lib/dialog/NKDialogContext.tsx";
import AddExpanseForm from "./forms/AddExpanseForm.tsx";

const NKExpenses = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [amountFrom, setAmountFrom] = useState<number | "">("");
  const [amountTo, setAmountTo] = useState<number | "">("");
  const [isPlanned, setIsPlanned] = useState<boolean | null>(null);

  const filteredRows = EXPANSES_MOCK.filter((row) => {
    const rowDate = dayjs(row.date);

    return (
      (nameFilter === "" ||
        row.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (categoryFilter.length === 0 || categoryFilter.includes(row.category)) &&
      (!dateFrom || rowDate.isAfter(dayjs(dateFrom).subtract(1, "day"))) &&
      (!dateTo || rowDate.isBefore(dayjs(dateTo).add(1, "day"))) &&
      (amountFrom === "" || row.amount >= amountFrom) &&
      (amountTo === "" || row.amount <= amountTo) &&
      (isPlanned === null || row.planned === (isPlanned ? "P" : "N"))
    );
  });

  const handleDelete = (selectedIds: string[]) => {
    console.log("handleDelete", selectedIds);
  };

  const { enqueueSnackbar } = useSnackbar();
  const { openDialog } = useDialog();

  return (
    <Grid container spacing={3} sx={{ padding: 3, marginTop: 5 }}>
      <Grid>
        <NKButton
          title="Dodaj wydatek"
          onClick={() => openDialog("Dodaj wydatek", <AddExpanseForm />)}
        ></NKButton>
      </Grid>
      <Grid>
        <NKButton
          title="Wczytaj wydatek z pliku"
          onClick={() => enqueueSnackbar("2", { variant: "error" })}
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
          sort={[{ field: "date", sort: "desc" }]}
          columns={expansesColumns.columns}
          rows={filteredRows}
          onDelete={handleDelete}
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
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export default NKExpenses;
