import { CategoryUiDTO } from "../../../api/generated";
import { toneFor, usagePercent } from "../../../lib/budgetStatus";

export type CategoryStatus = "all" | "near" | "over";
export type CategoryPeriod = "weeklyBudget" | "monthlyBudget" | "yearlyBudget";

export const CATEGORY_PERIODS: CategoryPeriod[] = ["weeklyBudget", "monthlyBudget", "yearlyBudget"];

export interface CategoryFilterState {
  name: string;
  status: CategoryStatus;
}

export const EMPTY_FILTERS: CategoryFilterState = { name: "", status: "all" };

export const periodPercent = (category: CategoryUiDTO, period: CategoryPeriod) =>
  usagePercent(Number(category[period]?.spentAmount ?? 0), Number(category[period]?.amount ?? 0));

// The worst of the three running periods: over the limit in any of them beats close to it.
const statusOf = (category: CategoryUiDTO): CategoryStatus | "ok" => {
  const tones = CATEGORY_PERIODS.map(period => toneFor(periodPercent(category, period)));
  if (tones.includes("error")) return "over";
  if (tones.includes("warning")) return "near";
  return "ok";
};

export const matchesFilters = (category: CategoryUiDTO, filters: CategoryFilterState) =>
  (category.name ?? "").toLowerCase().includes(filters.name.trim().toLowerCase()) &&
  (filters.status === "all" || statusOf(category) === filters.status);

export const hasActiveFilters = (filters: CategoryFilterState) =>
  filters.name.trim() !== "" || filters.status !== "all";
