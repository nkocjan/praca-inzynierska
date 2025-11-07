import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { FC } from "react";
import { Dayjs } from "dayjs";
import { CategoryDTO } from "../../../../api/generated";

interface ExpensesFiltersProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  categoryFilter: string[];
  setCategoryFilter: (value: string[]) => void;
  dateFrom: Dayjs | null;
  setDateFrom: (value: Dayjs | null) => void;
  dateTo: Dayjs | null;
  setDateTo: (value: Dayjs | null) => void;
  amountFrom: number | "";
  setAmountFrom: (value: number | "") => void;
  amountTo: number | "";
  setAmountTo: (value: number | "") => void;
  isPlanned: boolean | undefined;
  setIsPlanned: (value: boolean | undefined) => void;

  categories: CategoryDTO[];
  categoriesLoading: boolean;
}

const ExpensesFilters: FC<ExpensesFiltersProps> = ({
  nameFilter,
  setNameFilter,
  categoryFilter,
  setCategoryFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  amountFrom,
  setAmountFrom,
  amountTo,
  setAmountTo,
  isPlanned,
  setIsPlanned,
  categories,
  categoriesLoading,
}) => {
  function resetFilters() {
    setNameFilter("");
    setCategoryFilter([]);
    setDateFrom(null);
    setDateTo(null);
    setAmountFrom("");
    setAmountTo("");
    setIsPlanned(undefined);
  }

  return (
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

      <FormControl
        sx={{ width: "100%" }}
        size="small"
        disabled={categoriesLoading}
      >
        <InputLabel>Kategoria</InputLabel>
        <Select
          multiple
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as string[])}
          input={<OutlinedInput label="Kategoria" />}
          renderValue={(selected: string[]) =>
            selected.length == 1
              ? categories.find((category) => category.id === selected[0])?.name
              : `Wybrano: ${selected.length}/${categories.length}`
          }
          variant={"standard"}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              <Checkbox
                checked={categoryFilter.includes(category.id as string)}
              />
              <ListItemText primary={category.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePicker
        label="Data od"
        value={dateFrom}
        onChange={(newDate) => setDateFrom(newDate)}
        slotProps={{
          textField: { variant: "outlined", size: "small", sx: { height: 36 } },
        }}
        sx={{ width: "100%" }}
      />

      <DatePicker
        label="Data do"
        value={dateTo}
        onChange={(newDate) => setDateTo(newDate)}
        slotProps={{
          textField: { variant: "outlined", size: "small", sx: { height: 36 } },
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
            onChange={(e) => setIsPlanned(e.target.checked ? true : undefined)}
          />
        }
        label="Planowany"
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          resetFilters();
        }}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderColor: "rgba(255, 255, 255, 0.23)",
          borderRadius: "4px",
          fontSize: "0.875rem",
        }}
      >
        Reset
      </Button>
    </div>
  );
};

export default ExpensesFilters;
