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