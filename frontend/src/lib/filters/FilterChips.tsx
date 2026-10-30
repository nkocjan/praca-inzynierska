import { Button, Chip, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Dot } from "./FilterParts";

export interface FilterChip {
  key: string;
  label: string;
  color?: string;
  onDelete: () => void;
}

// The active filters as removable chips, so it is clear why the list is shorter.
const FilterChips = ({ chips, onClear }: { chips: FilterChip[]; onClear: () => void }) => {
  const { t } = useTranslation("common");

  if (chips.length === 0) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      useFlexGap
      flexWrap="wrap"
      spacing={1}
      sx={{ mt: 2 }}>
      {chips.map(chip => (
        <Chip
          key={chip.key}
          size="small"
          variant="outlined"
          label={chip.label}
          icon={chip.color ? <Dot color={chip.color} /> : undefined}
          onDelete={chip.onDelete}
          aria-label={t("filters.removeFilter", { label: chip.label })}
          sx={{ fontWeight: 500, "& .MuiChip-icon": { ml: 1, mr: -0.25 } }}
        />
      ))}
      <Button
        size="small"
        onClick={onClear}>
        {t("filters.clear")}
      </Button>
    </Stack>
  );
};

export default FilterChips;
