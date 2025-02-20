import { ExpanseStatusEnum } from "../enums/ExpanseStatusEnum.tsx";
import { ICategory } from "./ICategory.tsx";

export interface IExpanse {
  id: string;
  name: string;
  category: ICategory;
  amount: number;
  date: string;
  planned: ExpanseStatusEnum;
  description?: string;
}

export interface IExpanseCreateRequest {
  name: string;
  categoryId: string;
  amount: number;
  date: string;
  planned: ExpanseStatusEnum;
  description?: string;
}

export interface IExpanseUpdateRequest extends IExpanseCreateRequest {
  id: string;
}

// CREATE TABLE expenses (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID NOT NULL,
//   category_id UUID NOT NULL,
//   amount DECIMAL(10,2) NOT NULL,
//   date TIMESTAMP DEFAULT now(),
//   description TEXT,
//   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
// );
