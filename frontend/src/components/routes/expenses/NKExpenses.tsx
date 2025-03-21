import { NKButton } from "../../../lib/button/Button.tsx";
import Grid from "@mui/material/Grid2";
import NKGrid from "../../../lib/grid/NKGrid.tsx";
import expansesColumns from "./grid/expansesColumns.tsx";
import { useState } from "react";
import ExpensesFilters from "./grid/expenseFilters.tsx";
import dayjs, { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";
import { useDialog } from "../../../lib/dialog/NKDialogContext.tsx";
import AddExpanseForm from "./forms/AddEditExpanseForm.tsx";
import ConfirmDelete from "../../../lib/dialog/templates/ConfirmDelete.tsx";
import { IExpanse } from "../../../types/interfaces/IExpanse.tsx";
import { mockExpenses } from "../../../assets/mocks/ExpansesMock.ts";

const NKExpenses = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [amountFrom, setAmountFrom] = useState<number | "">("");
  const [amountTo, setAmountTo] = useState<number | "">("");
  const [isPlanned, setIsPlanned] = useState<boolean | null>(null);

  const filteredRows = mockExpenses.filter((row: IExpanse) => {
    const rowDate = dayjs(row.date);

    return (
      (nameFilter === "" ||
        row.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (categoryFilter.length === 0 ||
        categoryFilter.includes(row.category.id)) &&
      (!dateFrom || rowDate.isAfter(dayjs(dateFrom).subtract(1, "day"))) &&
      (!dateTo || rowDate.isBefore(dayjs(dateTo).add(1, "day"))) &&
      (amountFrom === "" || row.amount >= amountFrom) &&
      (amountTo === "" || row.amount <= amountTo) &&
      (isPlanned === null ||
        row.planned === (isPlanned ? "Zaplanowany" : "Dynamiczny"))
    );
  });
  const { openDialog } = useDialog();

  const handleDelete = (selectedIds: string[]) => {
    console.log(selectedIds);
    openDialog(
      {
        title: "Usuń wiele wydatków",
        saveButtonTitle: "Potwierdź usunięcie",
        cancelButtonTitle: "Anuluj",
      },
      <ConfirmDelete translation="wydatków"></ConfirmDelete>
    );
  };

  const { enqueueSnackbar } = useSnackbar();

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: 3, marginTop: 5 }}>
      <Grid>
        <NKButton
          title="Dodaj wydatek"
          onClick={() =>
            openDialog(
              {
                title: "Dodaj nowy wydatek",
                saveButtonTitle: "Dodaj",
                cancelButtonTitle: "Anuluj",
              },
              <AddExpanseForm />
            )
          }></NKButton>
      </Grid>
      <Grid>
        <NKButton
          title="Wczytaj wydatek z pliku"
          onClick={() => enqueueSnackbar("2", { variant: "error" })}></NKButton>
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
          sort={[{ field: "date", sort: "desc" }]}
          columns={expansesColumns.columns}
          rows={filteredRows}
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
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export default NKExpenses;
