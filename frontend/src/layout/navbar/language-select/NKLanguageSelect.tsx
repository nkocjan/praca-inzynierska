import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "../../../i18n/i18n";

const NKLanguageSelect = () => {
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(i18n.language);

  const handleChange = (event: SelectChangeEvent) => {
    void i18n.changeLanguage(normalizeLanguage(event.target.value));
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">
        {t("language.label")}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={language}
        label={t("language.label")}
        onChange={handleChange}>
        <MenuItem value={"pl"}>{t("language.pl")}</MenuItem>
        <MenuItem value={"en"}>{t("language.en")}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default NKLanguageSelect;
