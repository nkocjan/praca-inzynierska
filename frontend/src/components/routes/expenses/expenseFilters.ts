import dayjs, { Dayjs } from "dayjs";
import { ExpenseSearchRequestUiDTO } from "../../../api/generated";

export type ExpenseStatus = "all" | "paid" | "planned";
export type PeriodPreset = "all" | "thisMonth" | "lastMonth" | "last30" | "thisYear" | "custom";

export const PERIOD_PRESETS: PeriodPreset[] = ["all", "thisMonth", "lastMonth", "last30", "thisYear", "custom"];

export interface ExpenseFilterState {
  name: string;
  categoryIds: string[];
  status: ExpenseStatus;
  period: PeriodPreset;
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
  amountFrom: number | "";
  amountTo: number | "";
}

export const EMPTY_FILTERS: ExpenseFilterState = {
  name: "",
  categoryIds: [],
  status: "all",
  period: "all",
  dateFrom: null,
  dateTo: null,
  amountFrom: "",
  amountTo: "",
};

export const periodRange = (filters: ExpenseFilterState): { from: Dayjs | null; to: Dayjs | null } => {
  const now = dayjs();
  switch (filters.period) {
    case "thisMonth":
      return { from: now.startOf("month"), to: now.endOf("month") };
    case "lastMonth": {
      const last = now.subtract(1, "month");
      return { from: last.startOf("month"), to: last.endOf("month") };
    }
    case "last30":
      return { from: now.subtract(29, "day").startOf("day"), to: now.endOf("day") };
    case "thisYear":
      return { from: now.startOf("year"), to: now.endOf("year") };
    case "custom":
      return { from: filters.dateFrom?.startOf("day") ?? null, to: filters.dateTo?.endOf("day") ?? null };
    default:
      return { from: null, to: null };
  }
};

// The backend compares against LocalDateTime, so dates go out without a time zone.
const toLocal = (date: Dayjs | null) => (date ? date.format("YYYY-MM-DDTHH:mm:ss") : undefined);

export const toSearchRequest = (filters: ExpenseFilterState): ExpenseSearchRequestUiDTO => {
  const { from, to } = periodRange(filters);
  return {
    name: filters.name.trim() || undefined,
    categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
    dateFrom: toLocal(from),
    dateTo: toLocal(to),
    amountFrom: filters.amountFrom === "" ? undefined : filters.amountFrom,
    amountTo: filters.amountTo === "" ? undefined : filters.amountTo,
    isPlanned: filters.status === "all" ? undefined : filters.status === "planned",
  };
};

export const hasActiveFilters = (filters: ExpenseFilterState) =>
  filters.name.trim() !== "" ||
  filters.categoryIds.length > 0 ||
  filters.status !== "all" ||
  filters.period !== "all" ||
  filters.amountFrom !== "" ||
  filters.amountTo !== "";

// Filters hidden behind "More filters": used for the badge on that button.
export const countAdvancedFilters = (filters: ExpenseFilterState) =>
  (filters.amountFrom !== "" ? 1 : 0) + (filters.amountTo !== "" ? 1 : 0);
