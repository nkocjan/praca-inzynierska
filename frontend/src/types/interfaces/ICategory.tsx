export interface ICategory {
  id: string;
  name: string;
  weekBudget: number;
  monthBudget: number;
  yearBudget: number;
  otherBudget: Array<string>;
}
