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
import { Dayjs } from "dayjs";
import { FC } from "react";
import { mockCategories } from "../../../../assets/mocks/CategoriesMock";
import { DatePicker } from "@mui/x-date-pickers";

interface BudgetFiltersProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  categoryFilter: string[];
  setCategoryFilter: (value: string[]) => void;
  dateFrom: Dayjs | null;
  setDateFrom: (value: Dayjs | null) => void;
  dateTo: Dayjs | null;
  setDateTo: (value: Dayjs | null) => void;
  amountFrom: number | null;
  setAmountFrom: (value: number | null) => void;
  amountTo: number | null;
  setAmountTo: (value: number | null) => void;
  isArchived: boolean | null;
  setIsArchived: (value: boolean | null) => void;
  isOver: boolean | null;
  setIsOver: (value: boolean | null) => void;
}

const BudgetFilters: FC<BudgetFiltersProps> = ({
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
  isArchived,
  setIsArchived,
  isOver,
  setIsOver,
}) => {
  function resetFilters() {
    setNameFilter("");
    setCategoryFilter([]);
    setDateFrom(null);
    setDateTo(null);
    setAmountFrom(null);
    setAmountTo(null);
    setIsArchived(null);
    setIsOver(null);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gridTemplateRows: "repeat(2, auto)",
        gap: "8px",
        marginBottom: "10px",
      }}>
      <TextField
        label="Szukaj"
        variant="outlined"
        size="small"
        sx={{ width: "100%" }}
        value={nameFilter ?? ""}
        onChange={e => setNameFilter(e.target.value)}
      />

      <FormControl
        sx={{ width: "100%" }}
        size="small">
        <InputLabel>Kategoria</InputLabel>
        <Select
          multiple
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as string[])}
          input={<OutlinedInput label="Kategoria" />}
          renderValue={(selected: string[]) =>
            selected.length == 1
              ? mockCategories.find(category => category.id === selected[0])
                  ?.name
              : `Wybrano: ${selected.length}/${mockCategories.length}`
          }>
          {mockCategories.map(category => (
            <MenuItem
              key={category.id}
              value={category.id}>
              <Checkbox checked={categoryFilter.includes(category.id)} />
              <ListItemText primary={category.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePicker
        label="Data od"
        value={dateFrom ?? undefined}
        onChange={newDate => setDateFrom(newDate)}
        slotProps={{
          textField: { variant: "outlined", size: "small", sx: { height: 36 } },
        }}
        sx={{ width: "100%" }}
      />

      <DatePicker
        label="Data do"
        value={dateTo ?? undefined}
        onChange={newDate => setDateTo(newDate)}
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
        value={amountFrom ?? ""}
        onChange={e =>
          setAmountFrom(e.target.value ? null : Number(e.target.value))
        }
      />

      <TextField
        size="small"
        label="Kwota do"
        type="number"
        variant="outlined"
        sx={{ width: "100%" }}
        value={amountTo ?? ""}
        onChange={e =>
          setAmountTo(e.target.value ? null : Number(e.target.value))
        }
      />

      <FormControlLabel
        control={
          <Switch
            checked={isArchived === true}
            onChange={e => setIsArchived(e.target.checked ? true : null)}
          />
        }
        label="Archiwalny"
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={isOver === true}
            onChange={e => setIsOver(e.target.checked ? true : null)}
          />
        }
        label="Przekroczono"
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
        }}>
        Reset
      </Button>
    </div>
  );
};

export default BudgetFilters;
