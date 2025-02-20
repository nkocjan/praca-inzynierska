import {
  ICategory,
  ICategoryBudgetSummary,
} from "../../types/interfaces/ICategory";

export const mockCategories: ICategory[] = [
  { id: "cat-1", name: "Jedzenie", created_at: "2025-01-01T10:00:00Z" },
  { id: "cat-2", name: "Wynajem", created_at: "2025-01-02T10:00:00Z" },
  { id: "cat-3", name: "Zakupy", created_at: "2025-01-03T10:00:00Z" },
];

export const mockCategoryBudgetSummaries: ICategoryBudgetSummary[] = [
  {
    id: "cat-1",
    name: "Jedzenie",
    weekBudget: { name: "Tygodniowy Jedzenie", dateTo: "2025-02-23" },
    monthBudget: { name: "Miesięczny Jedzenie", dateTo: "2025-02-28" },
    yearBudget: { name: "Roczny Jedzenie", dateTo: "2025-12-31" },
    hasCustomBudgets: false, // Brak customowych budżetów
  },
  {
    id: "cat-2",
    name: "Wynajem",
    weekBudget: { name: "Tygodniowy Wynajem", dateTo: "2025-02-23" },
    monthBudget: { name: "Miesięczny Wynajem", dateTo: "2025-02-28" },
    yearBudget: { name: "Roczny Wynajem", dateTo: "2025-12-31" },
    hasCustomBudgets: false, // Brak customowych budżetów
  },
  {
    id: "cat-3",
    name: "Zakupy",
    weekBudget: { name: "Tygodniowy Zakupy", dateTo: "2025-02-23" },
    monthBudget: { name: "Miesięczny Zakupy", dateTo: "2025-02-28" },
    yearBudget: { name: "Roczny Zakupy", dateTo: "2025-12-31" },
    hasCustomBudgets: true, // Ma customowy budżet ("Budowa")
  },
];
