import { Box, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { getIntlLocale } from "../../../../i18n/locale";
import FilterChips, { FilterChip } from "../../../../lib/filters/FilterChips";
import { FilterAdornment } from "../../../../lib/filters/FilterParts";
import { CategoryFilterState, CategoryStatus } from "../categoryFilters";

interface CategoryFiltersBarProps {
  filters: CategoryFilterState;
  onChange: (patch: Partial<CategoryFilterState>) => void;
  onReset: () => void;
  resultCount: number | null;
}

const CategoryFiltersBar = ({ filters, onChange, onReset, resultCount }: CategoryFiltersBarProps) => {
  const { t, i18n } = useTranslation("categories");
  const language = normalizeLanguage(i18n.language);

  const chips: FilterChip[] = filters.name.trim()
    ? [{ key: "name", label: t("filters.searchChip", { value: filters.name.trim() }), onDelete: () => onChange({ name: "" }) }]
    : [];

  return (
    <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: { xs: 2, sm: 2.5 }, pb: 2 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={1.5}>
        <TextField
          size="small"
          value={filters.name}
          onChange={event => onChange({ name: event.target.value })}
          placeholder={t("filters.searchPlaceholder")}
          sx={{ width: { md: 300 } }}
          slotProps={{
            input: {
              startAdornment: (
                <FilterAdornment>
                  <SearchRoundedIcon />
                </FilterAdornment>
              ),
            },
            htmlInput: { "aria-label": t("filters.search") },
          }}
        />
        <ToggleButtonGroup
          exclusive
          size="small"
          value={filters.status}
          aria-label={t("status.label")}
          onChange={(_event, status: CategoryStatus | null) => status && onChange({ status })}
          sx={{ "& .MuiToggleButton-root": { px: { xs: 1, md: 2 }, whiteSpace: "nowrap", flexGrow: { xs: 1, md: 0 } } }}>
          {(["all", "near", "over"] as CategoryStatus[]).map(status => (
            <ToggleButton
              key={status}
              value={status}>
              {t(`status.${status}`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Typography
          variant="body2"
          color="text.secondary"
          aria-live="polite"
          sx={{ fontVariantNumeric: "tabular-nums", ml: { md: "auto !important" } }}>
          {resultCount !== null &&
            t("page.results", { count: resultCount, total: resultCount.toLocaleString(getIntlLocale(language)) })}
        </Typography>
      </Stack>

      <FilterChips
        chips={chips}
        onClear={onReset}
      />
    </Box>
  );
};

export default CategoryFiltersBar;
