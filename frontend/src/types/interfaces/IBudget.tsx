import { ICategory } from "./ICategory";

export interface IBudget {
  id: string;
  name: string;
  category: ICategory;
  amount: number;
  remainingAmount: number;
  dateFrom: string;
  dateTo: string;
  isPeriodic: boolean;
  durationDays: number;
  type: "week" | "month" | "year" | "custom";
}

export interface IBudgetCreateRequest {
  name: string;
  categoryId: string;
  amount: number;
  dateFrom: string;
  dateTo: string;
  isPeriodic: boolean;
  durationDays: number;
}

export interface IBudgetUpdateRequest extends IBudgetCreateRequest {
  id: string;
  remaining_amount: number;
}