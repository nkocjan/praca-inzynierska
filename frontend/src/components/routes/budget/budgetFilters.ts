import { Dayjs } from "dayjs";
import { BudgetSearchRequestDTO, BudgetUiDTOPeriodEnum } from "../../../api/generated";

// "active" covers the running periods and the ones planned ahead.
export type BudgetStatus = "active" | "ended" | "all";
export type BudgetPeriodType = BudgetUiDTOPeriodEnum;
export type PeriodTypeFilter = "all" | BudgetPeriodType;

export const PERIOD_TYPES: BudgetPeriodType[] = ["WEEK", "MONTH", "YEAR"];

export interface BudgetFilterState {
  status: BudgetStatus;
  categoryIds: string[];
  periodType: PeriodTypeFilter;
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
  amountFrom: number | "";
  amountTo: number | "";
}

export const EMPTY_FILTERS: BudgetFilterState = {
  status: "active",
  categoryIds: [],
  periodType: "all",
  dateFrom: null,
  dateTo: null,
  amountFrom: "",
  amountTo: "",
};

// The backend compares against LocalDateTime, so dates go out without a time zone.
const toLocal = (date: Dayjs | null) => (date ? date.format("YYYY-MM-DDTHH:mm:ss") : undefined);

export const toSearchRequest = (filters: BudgetFilterState): BudgetSearchRequestDTO => ({
  categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
  periodType: filters.periodType === "all" ? undefined : filters.periodType,
  isArchived: filters.status === "all" ? undefined : filters.status === "ended",
  periodDateFrom: toLocal(filters.dateFrom?.startOf("day") ?? null),
  periodDateTo: toLocal(filters.dateTo?.endOf("day") ?? null),
  amountFrom: filters.amountFrom === "" ? undefined : filters.amountFrom,
  amountTo: filters.amountTo === "" ? undefined : filters.amountTo,
});

export const hasActiveFilters = (filters: BudgetFilterState) =>
  filters.status !== EMPTY_FILTERS.status ||
  filters.categoryIds.length > 0 ||
  filters.periodType !== "all" ||
  filters.dateFrom !== null ||
  filters.dateTo !== null ||
  filters.amountFrom !== "" ||
  filters.amountTo !== "";

// Filters hidden behind "More filters": used for the badge on that button.
export const countAdvancedFilters = (filters: BudgetFilterState) =>
  [filters.dateFrom, filters.dateTo].filter(Boolean).length +
  (filters.amountFrom !== "" ? 1 : 0) +
  (filters.amountTo !== "" ? 1 : 0);
