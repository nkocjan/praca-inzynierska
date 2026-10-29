import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { CategoryRepDTO } from "../../../../api/generated";
import { useTranslation } from "react-i18next";

interface ConfigurationBoxProperties {
  height?: number | string;
  categories: CategoryRepDTO[];
  selectedCategory: string;
  onCategoryChange: (newCategoryId: string) => void;
}

const ConfigurationBox = (props: ConfigurationBoxProperties) => {
  const { t } = useTranslation(["dashboard", "common"]);
  const hasCategories = (props.categories?.length || 0) > 0;

  return (
    <Paper sx={{ height: props.height, padding: 2 }}>
      <FormControl
        fullWidth
        disabled={!hasCategories}>
        <InputLabel id="category-select-label">
          {t("dashboard:selectCategory")}
        </InputLabel>
        <Select
          labelId="category-select-label"
          value={hasCategories ? props.selectedCategory : ""}
          label={t("dashboard:selectCategory")}
          onChange={e => props.onCategoryChange(e.target.value as string)}
          variant={"standard"}>
          {props.categories.map(category => (
            <MenuItem
              key={category.id}
              value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!hasCategories && (
        <Typography
          variant="body2"
          sx={{ marginTop: 2, opacity: 0.9 }}>
          {t("common:noData")}
        </Typography>
      )}
    </Paper>
  );
};

export default ConfigurationBox;
