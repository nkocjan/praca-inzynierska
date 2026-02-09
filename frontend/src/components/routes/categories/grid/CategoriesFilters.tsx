import { Button, FormControlLabel, Switch, TextField } from "@mui/material";
import { FC } from "react";

interface CategoriesFiltersProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;

  hasAdditionalBudgets: boolean | null;

  setHasAdditionalBudgets: (value: boolean | null) => void;

  hasExceededBudget: boolean | null;

  setHasExceededBudget: (value: boolean | null) => void;
}

const CategoriesFilters: FC<CategoriesFiltersProps> = ({
  nameFilter,
  setNameFilter,
  hasAdditionalBudgets,
  setHasAdditionalBudgets,
  hasExceededBudget,
  setHasExceededBudget,
}) => {
  function resetFilters() {
    setNameFilter("");
    setHasAdditionalBudgets(null);
    setHasExceededBudget(null);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr 2fr 0.6fr",
        gap: "8px",
        marginBottom: "10px",
        alignItems: "center",
      }}>
      <TextField
        label="Szukaj"
        variant="outlined"
        size="small"
        sx={{ width: "100%" }}
        value={nameFilter}
        onChange={e => setNameFilter(e.target.value)}
      />
      {/* <FormControlLabel
        control={
          <Switch
            checked={hasAdditionalBudgets === true}
            onChange={e =>
              setHasAdditionalBudgets(e.target.checked ? true : null)
            }
          />
        }
        label="Dodatkowe budżety?"
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      /> */}
      <FormControlLabel
        control={
          <Switch
            checked={hasExceededBudget === true}
            onChange={e => setHasExceededBudget(e.target.checked ? true : null)}
          />
        }
        label="Przekroczony budżet?"
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
        onClick={resetFilters}
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

export default CategoriesFilters;
