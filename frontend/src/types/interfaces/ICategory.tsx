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

// CREATE TABLE categories (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID NOT NULL,
//   name VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP DEFAULT now(),
//   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// );

// CREATE TABLE users (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   email VARCHAR(255) UNIQUE NOT NULL,
//   password_hash VARCHAR(255) NOT NULL,
//   name VARCHAR(100) NOT NULL,
//   created_at TIMESTAMP DEFAULT now()
// );
