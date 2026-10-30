import dayjs, { Dayjs } from "dayjs";
import type { AppLanguage } from "../i18n/i18n";
import { formatDate } from "../i18n/locale";

export type BudgetTiming = "current" | "ended" | "upcoming";

export const budgetTiming = (start?: string, end?: string, now: Dayjs = dayjs()): BudgetTiming => {
  if (end && dayjs(end).isBefore(now)) return "ended";
  if (start && dayjs(start).isAfter(now)) return "upcoming";
  return "current";
};

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase() + text.slice(1);

// The period as people name it: "Październik 2026", "2026" or "26 paź - 1 lis 2026".
// The short form for narrow screens drops what the context makes obvious: "paź 2026", "26 paź - 1 lis".
export const formatBudgetPeriod = (
  period: string | undefined,
  start: string | undefined,
  end: string | undefined,
  language: AppLanguage,
  short = false,
): string => {
  if (!start) return "";
  const from = dayjs(start);
  if (period === "YEAR") return from.format("YYYY");
  if (period === "MONTH") return short ? formatDate(from, language, "MMM YYYY") : capitalize(formatDate(from, language, "MMMM YYYY"));
  const to = dayjs(end ?? start);
  const fromFormat = from.isSame(to, "year") || short ? "D MMM" : "D MMM YYYY";
  return `${formatDate(from, language, fromFormat)} - ${formatDate(to, language, short ? "D MMM" : "D MMM YYYY")}`;
};
