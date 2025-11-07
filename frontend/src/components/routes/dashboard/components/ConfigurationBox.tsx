import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { CategoryRepDTO } from "../../../../api/generated";

interface ConfigurationBoxProperties {
  height?: number | string;
  categories: CategoryRepDTO[];
  selectedCategory: string;
  onCategoryChange: (newCategoryId: string) => void;
}

const ConfigurationBox = (props: ConfigurationBoxProperties) => {
  return (
    <Paper sx={{ height: props.height, padding: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="category-select-label">Wybierz kategorię</InputLabel>
        <Select
          labelId="category-select-label"
          value={props.selectedCategory}
          label="Wybierz kategorię"
          onChange={(e) => props.onCategoryChange(e.target.value as string)}
          variant={"standard"}
        >
          {props.categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default ConfigurationBox;
