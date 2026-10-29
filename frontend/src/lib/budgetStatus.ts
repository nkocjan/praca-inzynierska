export type BudgetTone = "primary" | "warning" | "error";

export const usagePercent = (spent: number, budget: number): number => {
  if (budget > 0) return (spent / budget) * 100;
  return spent > 0 ? 101 : 0;
};

// Over 100% is an overrun; from 90% the budget is close to running out.
export const toneFor = (percent: number): BudgetTone => {
  if (percent > 100) return "error";
  if (percent >= 90) return "warning";
  return "primary";
};
