"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getDay } from "date-fns";
import {
  buildYearCells,
  buildMonthCells,
  buildWeekCells,
  buildDayCells,
  type Granularity,
  type LifeCell,
} from "@/lib/lifeCalendar";

interface Props {
  birthDate: Date;
  lifeExpectancy: number;
}

const TAB_LABELS: Record<Granularity, string> = {
  year: "年",
  month: "月",
  week: "週",
  day: "日",
};

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

export default function LifeGrid({ birthDate, lifeExpectancy }: Props) {
  const [tab, setTab] = useState<Granularity>("year");
  const [drillYear, setDrillYear] = useState<number | null>(null);
  const [drillMonth, setDrillMonth] = useState<number | null>(null);
  const currentCellRef = useRef<HTMLDivElement>(null);

  function selectTab(next: Granularity) {
    setTab(next);
    setDrillYear(null);
    setDrillMonth(null);
  }

  const cells: LifeCell[] = useMemo(() => {
    switch (tab) {
      case "year":
        return buildYearCells(birthDate, lifeExpectancy);
      case "month":
        return buildMonthCells(birthDate, lifeExpectancy, drillYear ?? undefined);
      case "week":
        return buildWeekCells(birthDate, lifeExpectancy);
      case "day":
        return buildDayCells(birthDate, lifeExpectancy, drillYear ?? undefined, drillMonth ?? undefined);
    }
  }, [tab, drillYear, drillMonth, birthDate, lifeExpectancy]);

  useEffect(() => {
    currentCellRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [tab, drillYear, drillMonth]);

  function handleYearClick(cell: LifeCell) {
    setTab("month");
    setDrillYear(cell.index);
    setDrillMonth(null);
  }

  function handleMonthClick(cell: LifeCell) {
    const yearIndex = drillYear ?? Math.floor(cell.index / 12);
    const monthIndex = drillYear != null ? cell.index : cell.index % 12;
    setTab("day");
    setDrillYear(yearIndex);
    setDrillMonth(monthIndex);
  }

  const lived = cells.filter((c) => c.isPast).length;
  const isCalendarDay = tab === "day" && drillYear != null && drillMonth != null;
  const leadingBlanks = isCalendarDay && cells.length > 0 ? getDay(cells[0].start) : 0;

  const cols =
    tab === "year"
      ? 10
      : tab === "month"
      ? (drillYear != null ? 4 : 12)
      : tab === "week"
      ? 52
      : isCalendarDay
      ? 7
      : undefined;

  const clickable = tab === "year" || tab === "month";

  function cellClass(cell: LifeCell) {
    const color = cell.isCurrent
      ? "bg-amber-400"
      : cell.isPast
      ? "bg-white/20 border border-white/5"
      : "bg-white";
    const interactive = clickable ? "cursor-pointer hover:ring-2 hover:ring-amber-400/60" : "";
    return `aspect-square transition-colors ${color} ${interactive}`;
  }

  function onCellClick(cell: LifeCell) {
    if (tab === "year") handleYearClick(cell);
    else if (tab === "month") handleMonthClick(cell);
  }

  const breadcrumbs: { label: string; onClick: () => void }[] = [
    { label: `${TAB_LABELS[tab]}總覽`, onClick: () => selectTab(tab) },
  ];
  if (tab === "month" && drillYear != null) {
    breadcrumbs.push({ label: `第 ${drillYear + 1} 歲`, onClick: () => {} });
  }
  if (tab === "day") {
    if (drillYear != null) {
      breadcrumbs.push({
        label: `第 ${drillYear + 1} 歲`,
        onClick: () => {
          setTab("month");
          setDrillMonth(null);
        },
      });
    }
    if (drillMonth != null) {
      breadcrumbs.push({ label: `第 ${drillMonth + 1} 月`, onClick: () => {} });
    }
  }

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-white/30 uppercase">
          人生日曆
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1">
            {(Object.keys(TAB_LABELS) as Granularity[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => selectTab(g)}
                className={`border px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-colors ${
                  tab === g
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/50 hover:border-white/40"
                }`}
              >
                {TAB_LABELS[g]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs text-white/40">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-white/20">›</span>}
                <button
                  type="button"
                  onClick={b.onClick}
                  className="tracking-wide transition-colors hover:text-white"
                >
                  {b.label}
                </button>
              </span>
            ))}
          </div>
        </div>

        <p className="mb-6 text-sm text-white/40">
          此檢視共 <span className="text-white">{cells.length}</span> 格，已過{" "}
          <span className="text-white">{lived}</span> 格，剩餘{" "}
          <span className="text-white">{cells.length - lived}</span> 格
        </p>

        {isCalendarDay && (
          <div className="mb-1 grid grid-cols-7 gap-px text-center text-[10px] text-white/30">
            {WEEKDAY_LABELS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid gap-px"
          style={
            cols
              ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
              : { gridTemplateColumns: "repeat(auto-fill, minmax(5px, 1fr))" }
          }
        >
          {isCalendarDay &&
            Array.from({ length: leadingBlanks }).map((_, i) => <div key={`blank-${i}`} />)}
          {cells.map((cell) => (
            <div
              key={cell.index}
              ref={cell.isCurrent ? currentCellRef : undefined}
              title={cell.sublabel}
              onClick={() => onCellClick(cell)}
              className={cellClass(cell)}
            >
              {(tab === "year" || (tab === "month" && drillYear != null) || isCalendarDay) && (
                <span
                  className={`flex h-full w-full items-center justify-center text-[10px] ${
                    cell.isCurrent ? "text-black/70" : cell.isPast ? "text-white/50" : "text-black/40"
                  }`}
                >
                  {cell.label}
                </span>
              )}
            </div>
          ))}
        </motion.div>

        <div className="mt-4 flex items-center gap-6 text-xs text-white/30">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 bg-white/20" /> 已過去
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 bg-white" /> 尚未來到
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 bg-amber-400" /> 現在
          </span>
        </div>
      </div>
    </section>
  );
}
