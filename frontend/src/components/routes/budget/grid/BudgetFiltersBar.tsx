import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Collapse,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { DatePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";
import { CategoryDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { formatDate, getCurrencySymbol, getIntlLocale } from "../../../../i18n/locale";
import CategoryMultiSelect from "../../../../lib/filters/CategoryMultiSelect";
import FilterChips, { FilterChip } from "../../../../lib/filters/FilterChips";
import { FilterAdornment } from "../../../../lib/filters/FilterParts";
import {
  BudgetFilterState,
  BudgetStatus,
  countAdvancedFilters,
  PERIOD_TYPES,
  PeriodTypeFilter,
} from "../budgetFilters";

interface BudgetFiltersBarProps {
  filters: BudgetFilterState;
  onChange: (patch: Partial<BudgetFilterState>) => void;
  onReset: () => void;
  categories: CategoryDTO[];
  categoriesLoading: boolean;
  colorFor: (categoryId?: string) => string;
  resultCount: number | null;
}

const BudgetFiltersBar = ({
  filters,
  onChange,
  onReset,
  categories,
  categoriesLoading,
  colorFor,
  resultCount,
}: BudgetFiltersBarProps) => {
  const { t, i18n } = useTranslation("budgets");
  const language = normalizeLanguage(i18n.language);
  const advancedCount = countAdvancedFilters(filters);
  const [moreOpen, setMoreOpen] = useState(advancedCount > 0);
  const currency = getCurrencySymbol(language);
  const categoryName = (id: string) => categories.find(category => category.id === id)?.name ?? "";

  const amountValue = (value: string): number | "" => (value === "" ? "" : Number(value));

  const range = (from: string, to: string) => {
    if (from && to) return `${from} - ${to}`;
    return from ? `≥ ${from}` : `≤ ${to}`;
  };

  const chips: FilterChip[] = [
    ...filters.categoryIds.map(id => ({
      key: `category-${id}`,
      label: categoryName(id),
      color: colorFor(id),
      onDelete: () => onChange({ categoryIds: filters.categoryIds.filter(selected => selected !== id) }),
    })),
    ...(filters.periodType !== "all"
      ? [{ key: "periodType", label: t(`filters.periodTypes.${filters.periodType}`), onDelete: () => onChange({ periodType: "all" }) }]
      : []),
    ...(filters.dateFrom || filters.dateTo
      ? [
          {
            key: "dates",
            label: t("filters.dateChip", {
              range: range(
                filters.dateFrom ? formatDate(filters.dateFrom, language) : "",
                filters.dateTo ? formatDate(filters.dateTo, language) : "",
              ),
            }),
            onDelete: () => onChange({ dateFrom: null, dateTo: null }),
          },
        ]
      : []),
    ...(filters.amountFrom !== "" || filters.amountTo !== ""
      ? [
          {
            key: "amount",
            label: t("filters.amountChip", {
              range: `${range(`${filters.amountFrom}`, `${filters.amountTo}`)} ${currency}`,
            }),
            onDelete: () => onChange({ amountFrom: "", amountTo: "" }),
          },
        ]
      : []),
  ];

  return (
    <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: { xs: 2, sm: 2.5 }, pb: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2 }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={filters.status}
          aria-label={t("status.label")}
          onChange={(_event, status: BudgetStatus | null) => status && onChange({ status })}
          sx={{ "& .MuiToggleButton-root": { px: 2, flexGrow: { xs: 1, sm: 0 } } }}>
          {(["active", "ended", "all"] as BudgetStatus[]).map(status => (
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
          sx={{ fontVariantNumeric: "tabular-nums" }}>
          {resultCount !== null &&
            t("page.results", { count: resultCount, total: resultCount.toLocaleString(getIntlLocale(language)) })}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: { xs: "1fr 1fr", md: "minmax(220px, 280px) minmax(200px, 240px) auto" },
          justifyContent: { md: "start" },
        }}>
        <CategoryMultiSelect
          id="budget-filter-category"
          categories={categories}
          value={filters.categoryIds}
          onChange={categoryIds => onChange({ categoryIds })}
          colorFor={colorFor}
          disabled={categoriesLoading}
        />

        <Box sx={{ minWidth: 0 }}>
          <Box
            id="budget-filter-period-type-label"
            sx={visuallyHidden}>
            {t("filters.periodType")}
          </Box>
          <Select
            size="small"
            fullWidth
            labelId="budget-filter-period-type-label"
            value={filters.periodType}
            onChange={event => onChange({ periodType: event.target.value as PeriodTypeFilter })}
            // "All periods" stays in the menu; the closed field gets a short label that fits on phones.
            renderValue={(value: PeriodTypeFilter) => t(value === "all" ? "filters.periodTypes.allShort" : `filters.periodTypes.${value}`)}
            startAdornment={
              <FilterAdornment>
                <EventRepeatOutlinedIcon />
              </FilterAdornment>
            }>
            <MenuItem value="all">{t("filters.periodTypes.all")}</MenuItem>
            {PERIOD_TYPES.map(type => (
              <MenuItem
                key={type}
                value={type}>
                {t(`filters.periodTypes.${type}`)}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Button
          variant="outlined"
          color="inherit"
          onClick={() => setMoreOpen(open => !open)}
          aria-expanded={moreOpen}
          aria-controls="budget-more-filters"
          startIcon={
            <Badge
              color="primary"
              badgeContent={advancedCount}
              sx={{ "& .MuiBadge-badge": { fontSize: 11, height: 16, minWidth: 16 } }}>
              <TuneRoundedIcon />
            </Badge>
          }
          sx={{ gridColumn: { xs: "1 / -1", md: "auto" }, borderColor: "divider", whiteSpace: "nowrap" }}>
          {t("filters.more")}
        </Button>
      </Box>

      <Collapse
        in={moreOpen}
        id="budget-more-filters">
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            pt: 1.5,
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, minmax(0, 200px))" },
          }}>
          <DatePicker
            label={t("filters.dateFrom")}
            value={filters.dateFrom}
            maxDate={filters.dateTo ?? undefined}
            onChange={dateFrom => onChange({ dateFrom })}
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            label={t("filters.dateTo")}
            value={filters.dateTo}
            minDate={filters.dateFrom ?? undefined}
            onChange={dateTo => onChange({ dateTo })}
            slotProps={{ textField: { size: "small" } }}
          />
          <TextField
            size="small"
            type="number"
            label={t("filters.amountFrom")}
            value={filters.amountFrom}
            onChange={event => onChange({ amountFrom: amountValue(event.target.value) })}
            slotProps={{
              input: { endAdornment: <InputAdornment position="end">{currency}</InputAdornment> },
              htmlInput: { min: 0, step: "0.01" },
            }}
          />
          <TextField
            size="small"
            type="number"
            label={t("filters.amountTo")}
            value={filters.amountTo}
            onChange={event => onChange({ amountTo: amountValue(event.target.value) })}
            slotProps={{
              input: { endAdornment: <InputAdornment position="end">{currency}</InputAdornment> },
              htmlInput: { min: 0, step: "0.01" },
            }}
          />
        </Box>
      </Collapse>

      <FilterChips
        chips={chips}
        onClear={onReset}
      />
    </Box>
  );
};

export default BudgetFiltersBar;
