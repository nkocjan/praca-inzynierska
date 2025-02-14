import { ExpanseStatusEnum } from "../enums/ExpanseStatusEnum.tsx";

export interface IExpanse {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  planned: ExpanseStatusEnum;
  description?: string;
}
