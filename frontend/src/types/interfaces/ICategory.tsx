export interface ICategory {
  id: string;
  name: string;
  created_at: string;
}

export interface ICategoryBudgetSummary {
  id: string;
  name: string;
  weekBudget?: {
    name: string;
    dateTo: string;
    amount: number;
    spentAmount: number;
  };
  monthBudget?: {
    name: string;
    dateTo: string;
    amount: number;
    spentAmount: number;
  };
  yearBudget?: {
    name: string;
    dateTo: string;
    amount: number;
    spentAmount: number;
  };
  hasCustomBudgets: boolean;
}

export interface ICategoryCreateRequest {
  name: string;
}

export interface ICategoryUpdateRequest extends ICategoryCreateRequest {
  id: string;
}