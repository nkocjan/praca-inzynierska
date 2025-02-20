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

// CREATE TABLE budgets (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID NOT NULL,
//   category_id UUID NOT NULL,
//   name VARCHAR(255) NOT NULL,
//   amount DECIMAL(10,2) NOT NULL,
//   remaining_amount DECIMAL(10,2) NOT NULL,
//   date_from DATE NOT NULL,
//   date_to DATE,
//   is_periodic BOOLEAN DEFAULT false,
//   duration_days INT CHECK (duration_days > 0),
//   created_at TIMESTAMP DEFAULT now(),
//   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
// );
