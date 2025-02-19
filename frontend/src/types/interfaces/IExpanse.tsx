import { ExpanseStatusEnum } from "../enums/ExpanseStatusEnum.tsx";
import { IDictionaryItem } from "./IDictionaryItem.ts";

export interface IExpanse {
  id: string;
  name: string;
  category: IDictionaryItem;
  amount: number;
  date: string;
  planned: ExpanseStatusEnum;
  description?: string;
}
