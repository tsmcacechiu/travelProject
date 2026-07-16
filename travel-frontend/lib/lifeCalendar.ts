import { addYears, addMonths, addWeeks, addDays, differenceInCalendarDays, format } from "date-fns";

export type Granularity = "year" | "month" | "week" | "day";

export interface LifeCell {
  index: number;
  start: Date;
  end: Date;
  isPast: boolean;
  isCurrent: boolean;
  label: string;
  sublabel: string;
}

function buildCells(
  origin: Date,
  count: number,
  step: (base: Date, i: number) => Date,
  labelFn: (i: number, start: Date) => string,
  sublabelFn: (i: number, start: Date) => string
): LifeCell[] {
  const now = new Date();
  const cells: LifeCell[] = [];
  for (let i = 0; i < count; i++) {
    const start = step(origin, i);
    const end = step(origin, i + 1);
    cells.push({
      index: i,
      start,
      end,
      isPast: end <= now,
      isCurrent: start <= now && now < end,
      label: labelFn(i, start),
      sublabel: sublabelFn(i, start),
    });
  }
  return cells;
}

export function totalYears(lifeExpectancy: number): number {
  return Math.ceil(lifeExpectancy);
}

export function totalMonths(lifeExpectancy: number): number {
  return Math.ceil(lifeExpectancy * 12);
}

export function totalWeeksPrecise(birthDate: Date, lifeExpectancy: number): number {
  const death = addYears(birthDate, lifeExpectancy);
  return Math.ceil(differenceInCalendarDays(death, birthDate) / 7);
}

export function totalDaysPrecise(birthDate: Date, lifeExpectancy: number): number {
  const death = addYears(birthDate, lifeExpectancy);
  return differenceInCalendarDays(death, birthDate);
}

export function buildYearCells(birthDate: Date, lifeExpectancy: number): LifeCell[] {
  return buildCells(
    birthDate,
    totalYears(lifeExpectancy),
    (d, i) => addYears(d, i),
    (i) => `${i + 1}`,
    (_i, start) => format(start, "yyyy")
  );
}

export function buildMonthCells(birthDate: Date, lifeExpectancy: number, yearIndex?: number): LifeCell[] {
  if (yearIndex != null) {
    const yearStart = addYears(birthDate, yearIndex);
    return buildCells(
      yearStart,
      12,
      (d, i) => addMonths(d, i),
      (i) => `${i + 1}`,
      (_i, start) => format(start, "yyyy/MM")
    );
  }
  return buildCells(
    birthDate,
    totalMonths(lifeExpectancy),
    (d, i) => addMonths(d, i),
    (i) => `${i + 1}`,
    (_i, start) => format(start, "yyyy/MM")
  );
}

export function buildWeekCells(birthDate: Date, lifeExpectancy: number): LifeCell[] {
  return buildCells(
    birthDate,
    totalWeeksPrecise(birthDate, lifeExpectancy),
    (d, i) => addWeeks(d, i),
    (i) => `${i + 1}`,
    (_i, start) => format(start, "yyyy/MM/dd")
  );
}

export function buildDayCells(
  birthDate: Date,
  lifeExpectancy: number,
  yearIndex?: number,
  monthIndex?: number
): LifeCell[] {
  if (yearIndex != null && monthIndex != null) {
    const monthStart = addMonths(addYears(birthDate, yearIndex), monthIndex);
    const daysInThisMonth = differenceInCalendarDays(addMonths(monthStart, 1), monthStart);
    return buildCells(
      monthStart,
      daysInThisMonth,
      (d, i) => addDays(d, i),
      (i, start) => format(start, "d"),
      (_i, start) => format(start, "yyyy/MM/dd")
    );
  }
  return buildCells(
    birthDate,
    totalDaysPrecise(birthDate, lifeExpectancy),
    (d, i) => addDays(d, i),
    (i) => `${i + 1}`,
    (_i, start) => format(start, "yyyy/MM/dd")
  );
}
