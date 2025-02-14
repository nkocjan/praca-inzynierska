import { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Switch,
  FormControlLabel,
  SxProps,
  Theme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { IExpanse } from "../../types/interfaces/IExpanse.tsx";

interface Properties {
  columns: GridColDef[];
  rows: Array<IExpanse>;
  sx?: SxProps<Theme>;
}

const paginationModel = { page: 0, pageSize: 5 };

const NKGrid = (props: Properties) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 🔹 Aktualizacja szerokości okna w stanie
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [amountFrom, setAmountFrom] = useState<number | "">("");
  const [amountTo, setAmountTo] = useState<number | "">("");
  const [isPlanned, setIsPlanned] = useState<boolean | null>(null);

  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Health",
    "Education",
    "Utilities",
    "Rent",
    "Shopping",
    "Savings",
    "Other",
  ];

  const filteredRows = props.rows.filter((row) => {
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

  return (
    <Paper
      sx={{
        width: "100%",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 400,
        overflow: "hidden",
        ...props.sx,
      }}
    >
      {/* 🔹 Filtry */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gridTemplateRows: "repeat(2, auto)",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <TextField
          label="Szukaj"
          variant="outlined"
          size="small"
          sx={{ width: "100%" }}
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel>Kategoria</InputLabel>
          <Select
            multiple
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as string[])}
            input={<OutlinedInput label="Kategoria" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                <Checkbox checked={categoryFilter.includes(category)} />
                <ListItemText primary={category} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Data od"
          value={dateFrom}
          onChange={(newDate) => setDateFrom(newDate)}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              sx: { height: 36 },
            },
          }}
          sx={{ width: "100%" }}
        />

        <DatePicker
          label="Data do"
          value={dateTo}
          onChange={(newDate) => setDateTo(newDate)}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              sx: { height: 36 },
            },
          }}
          sx={{ width: "100%" }}
        />

        <TextField
          size="small"
          label="Kwota od"
          type="number"
          variant="outlined"
          sx={{ width: "100%" }}
          value={amountFrom}
          onChange={(e) =>
            setAmountFrom(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <TextField
          size="small"
          label="Kwota do"
          type="number"
          variant="outlined"
          sx={{ width: "100%" }}
          value={amountTo}
          onChange={(e) =>
            setAmountTo(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={isPlanned === true}
              onChange={(e) => setIsPlanned(e.target.checked ? true : null)}
            />
          }
          label="Planowany"
          sx={{ width: "100%" }}
        />
      </div>

      {/* 🔹 Tabela z kontrolowaną wysokością */}
      <div style={{ flexGrow: 1, overflow: "hidden" }}>
        <DataGrid
          key={windowWidth}
          columns={props.columns}
          rows={filteredRows}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0, height: "100%" }} // ✅ Zapewnia dopasowanie wysokości
        />
      </div>
    </Paper>
  );
};

export default NKGrid;
