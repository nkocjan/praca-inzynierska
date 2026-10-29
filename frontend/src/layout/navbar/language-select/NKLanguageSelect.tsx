import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AppLanguage, normalizeLanguage } from "../../../i18n/i18n";

const LANGUAGES: AppLanguage[] = ["pl", "en"];

const NKLanguageSelect = () => {
  const { t, i18n } = useTranslation("common");
  const language = normalizeLanguage(i18n.language);

  return (
    <ToggleButtonGroup
      value={language}
      exclusive
      size="small"
      aria-label={t("language.label")}
      onChange={(_event, value: AppLanguage | null) => {
        if (value) void i18n.changeLanguage(value);
      }}>
      {LANGUAGES.map(lang => (
        <ToggleButton
          key={lang}
          value={lang}
          aria-label={t(`language.${lang}`)}
          sx={{ px: 1.5, py: 0.75 }}>
          {t(`language.short.${lang}`)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default NKLanguageSelect;
