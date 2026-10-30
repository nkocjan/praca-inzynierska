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
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
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
  countAdvancedFilters,
  ExpenseFilterState,
  ExpenseStatus,
  PERIOD_PRESETS,
  PeriodPreset,
} from "../expenseFilters";

interface ExpenseFiltersBarProps {
  filters: ExpenseFilterState;
  onChange: (patch: Partial<ExpenseFilterState>) => void;
  onReset: () => void;
  categories: CategoryDTO[];
  categoriesLoading: boolean;
  colorFor: (categoryId?: string) => string;
  resultCount: number | null;
}

const ExpenseFiltersBar = ({
  filters,
  onChange,
  onReset,
  categories,
  categoriesLoading,
  colorFor,
  resultCount,
}: ExpenseFiltersBarProps) => {
  const { t, i18n } = useTranslation("expenses");
  const language = normalizeLanguage(i18n.language);
  const [moreOpen, setMoreOpen] = useState(countAdvancedFilters(filters) > 0 || filters.period === "custom");
  const advancedCount = countAdvancedFilters(filters);
  const currency = getCurrencySymbol(language);
  const categoryName = (id: string) => categories.find(category => category.id === id)?.name ?? "";

  const changePeriod = (period: PeriodPreset) => {
    onChange({ period });
    if (period === "custom") setMoreOpen(true);
  };

  const amountValue = (value: string): number | "" => (value === "" ? "" : Number(value));

  const amountRange = () => {
    const from = filters.amountFrom === "" ? "" : `${filters.amountFrom}`;
    const to = filters.amountTo === "" ? "" : `${filters.amountTo}`;
    if (from && to) return `${from}-${to} ${currency}`;
    return from ? `≥ ${from} ${currency}` : `≤ ${to} ${currency}`;
  };

  const periodChipLabel = () => {
    if (filters.period !== "custom") return t(`filters.periods.${filters.period}`);
    const from = filters.dateFrom ? formatDate(filters.dateFrom, language) : "...";
    const to = filters.dateTo ? formatDate(filters.dateTo, language) : "...";
    return `${from} - ${to}`;
  };

  const chips: FilterChip[] = [
    ...(filters.name.trim()
      ? [{ key: "name", label: t("filters.searchChip", { value: filters.name.trim() }), onDelete: () => onChange({ name: "" }) }]
      : []),
    ...filters.categoryIds.map(id => ({
      key: `category-${id}`,
      label: categoryName(id),
      color: colorFor(id),
      onDelete: () => onChange({ categoryIds: filters.categoryIds.filter(selected => selected !== id) }),
    })),
    ...(filters.period !== "all"
      ? [{ key: "period", label: periodChipLabel(), onDelete: () => onChange({ period: "all", dateFrom: null, dateTo: null }) }]
      : []),
    ...(filters.amountFrom !== "" || filters.amountTo !== ""
      ? [{ key: "amount", label: t("filters.amountChip", { range: amountRange() }), onDelete: () => onChange({ amountFrom: "", amountTo: "" }) }]
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
          onChange={(_event, status: ExpenseStatus | null) => status && onChange({ status })}
          sx={{ "& .MuiToggleButton-root": { px: 2, flexGrow: { xs: 1, sm: 0 } } }}>
          {(["all", "paid", "planned"] as ExpenseStatus[]).map(status => (
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
          gridTemplateColumns: { xs: "1fr 1fr", md: "minmax(220px, 1fr) 210px 200px auto" },
        }}>
        <TextField
          size="small"
          value={filters.name}
          onChange={event => onChange({ name: event.target.value })}
          placeholder={t("filters.searchPlaceholder")}
          sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}
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

        <CategoryMultiSelect
          id="expense-filter-category"
          categories={categories}
          value={filters.categoryIds}
          onChange={categoryIds => onChange({ categoryIds })}
          colorFor={colorFor}
          disabled={categoriesLoading}
        />

        <Box sx={{ minWidth: 0 }}>
          <Box
            id="expense-filter-period-label"
            sx={visuallyHidden}>
            {t("filters.period")}
          </Box>
          <Select
            size="small"
            fullWidth
            labelId="expense-filter-period-label"
            value={filters.period}
            onChange={event => changePeriod(event.target.value as PeriodPreset)}
            startAdornment={
              <FilterAdornment>
                <DateRangeOutlinedIcon />
              </FilterAdornment>
            }>
            {PERIOD_PRESETS.map(period => (
              <MenuItem
                key={period}
                value={period}>
                {t(`filters.periods.${period}`)}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Button
          variant="outlined"
          color="inherit"
          onClick={() => setMoreOpen(open => !open)}
          aria-expanded={moreOpen}
          aria-controls="expense-more-filters"
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
        id="expense-more-filters">
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            pt: 1.5,
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, minmax(0, 200px))" },
          }}>
          {filters.period === "custom" && (
            <>
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
            </>
          )}
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

export default ExpenseFiltersBar;
