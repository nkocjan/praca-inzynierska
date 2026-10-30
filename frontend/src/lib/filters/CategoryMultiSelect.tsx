import { Box, Checkbox, ListItemText, MenuItem, Select } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { useTranslation } from "react-i18next";
import { Dot, FilterAdornment } from "./FilterParts";

interface CategoryMultiSelectProps {
  id: string;
  categories: { id?: string; name?: string }[];
  value: string[];
  onChange: (categoryIds: string[]) => void;
  colorFor: (categoryId?: string) => string;
  disabled?: boolean;
}

const CategoryMultiSelect = ({ id, categories, value, onChange, colorFor, disabled }: CategoryMultiSelectProps) => {
  const { t } = useTranslation("common");
  const categoryName = (categoryId: string) => categories.find(category => category.id === categoryId)?.name ?? "";
  const labelId = `${id}-label`;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Box
        id={labelId}
        sx={visuallyHidden}>
        {t("filters.category")}
      </Box>
      <Select
        size="small"
        fullWidth
        multiple
        displayEmpty
        labelId={labelId}
        disabled={disabled}
        value={value}
        onChange={event => onChange(event.target.value as string[])}
        startAdornment={
          <FilterAdornment>
            <CategoryOutlinedIcon />
          </FilterAdornment>
        }
        renderValue={(selected: string[]) =>
          selected.length === 0
            ? t("filters.allCategories")
            : selected.length === 1
              ? categoryName(selected[0])
              : t("filters.categoriesSelected", { count: selected.length })
        }
        MenuProps={{ slotProps: { paper: { sx: { maxHeight: 360 } } } }}>
        {categories.map(category => (
          <MenuItem
            key={category.id}
            value={category.id}
            sx={{ gap: 1 }}>
            <Checkbox
              size="small"
              checked={value.includes(category.id ?? "")}
              sx={{ p: 0.5 }}
            />
            <Dot color={colorFor(category.id)} />
            <ListItemText primary={category.name} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default CategoryMultiSelect;
