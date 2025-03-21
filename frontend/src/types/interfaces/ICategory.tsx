export interface ICategory {
  id: string;
  name: string;
  created_at: string;
}

export interface ICategoryBudgetSummary {
  id: string;
  name: string;
  weekBudget?: { name: string; dateTo: string };
  monthBudget?: { name: string; dateTo: string };
  yearBudget?: { name: string; dateTo: string };
  hasCustomBudgets: boolean;
}

export interface ICategoryCreateRequest {
  name: string;
}

export interface ICategoryUpdateRequest extends ICategoryCreateRequest {
  id: string;
}