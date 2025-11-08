import { isValid, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";

export function formatDateRange(range: DateRange) {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const from = range.from?.toLocaleDateString("en-US", {
    ...opts,
    timeZone: "UTC",
  });
  const to = range.to?.toLocaleDateString("en-US", {
    ...opts,
    timeZone: "UTC",
  });
  return from && to ? `${from} - ${to}` : from ? `${from} - …` : "Select date";
}

export function formatLocalYMD(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getLast7Days(): { from: Date; to: Date } {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 7);
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  return { from, to };
}

export function getLast7DaysTinybird(): { from: string; to: string } {
  const { from, to } = getLast7Days();
  return {
    from: from.toISOString().replace("T", " ").replace("Z", ""),
    to: to.toISOString().replace("T", " ").replace("Z", ""),
  };
}

export function parseValidatedDateRange(raw: string | undefined): {
  from: string;
  to: string;
} {
  if (!raw) return getLast7DaysTinybird();

  const parts = raw.split(",");
  if (parts.length !== 2) return getLast7DaysTinybird();

  const from = parseISO(parts[0]);
  const to = parseISO(parts[1]);

  const fromIsValid = isValid(from);
  const toIsValid = isValid(to);

  if (!fromIsValid || !toIsValid || from > to) return getLast7DaysTinybird();

  to.setHours(23, 59, 59, 999);

  return {
    from: from.toISOString().replace("T", " ").replace("Z", ""),
    to: to.toISOString().replace("T", " ").replace("Z", ""),
  };
}

export function parseDateRange(value: string | null): DateRange | null {
  if (!value) return null;
  const [fromStr, toStr] = value.split(",");
  const from = fromStr ? new Date(fromStr) : undefined;
  const to = toStr ? new Date(toStr) : undefined;
  return { from, to };
}

export function serializeDateRange(value: DateRange | null): string {
  if (!value?.from && !value?.to) return "";
  const from = value?.from ? formatLocalYMD(value.from) : "";
  const to = value?.to ? formatLocalYMD(value.to) : "";
  return `${from},${to}`;
}
