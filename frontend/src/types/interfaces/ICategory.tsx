export interface ICategory {
  id: string;
  name: string;
  created_at: string;
}

export interface ICategoryBudgetSummary {
  id: string;
  name: string;
  weeklyBudget?: {
    name: string;
    dateTo: string;
    amount: number;
    spentAmount: number;
  };
  monthlyBudget?: {
    name: string;
    dateTo: string;
    amount: number;
    spentAmount: number;
  };
  yearlyBudget?: {
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
