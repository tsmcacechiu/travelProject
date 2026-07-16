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
  const isDrilled = drillYear != null || drillMonth != null;

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
      ? "bg-amber-400 ring-2 ring-amber-300 shadow-[0_0_10px_2px_rgba(251,191,36,0.55)] z-10"
      : cell.isPast
      ? "bg-zinc-600"
      : "bg-white";
    const interactive = clickable
      ? "cursor-pointer hover:scale-[1.15] hover:ring-2 hover:ring-amber-400 hover:z-10"
      : "";
    return `aspect-square rounded-[2px] border border-black/10 transition-all ${color} ${interactive}`;
  }

  function onCellClick(cell: LifeCell) {
    if (tab === "year") handleYearClick(cell);
    else if (tab === "month") handleMonthClick(cell);
  }

  const breadcrumbs: { label: string; onClick: () => void }[] = [];
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

  const hint =
    tab === "year"
      ? "點擊任一年份，可查看該年的 12 個月"
      : tab === "month"
      ? "點擊任一月份，可查看該月的每一天"
      : tab === "week"
      ? "此為總覽視圖，尚無法點擊深入"
      : isCalendarDay
      ? null
      : "此為總覽視圖，可從「月」檢視點擊月份查看單日";

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
        <p className="mb-1 text-xs font-semibold tracking-[0.3em] text-white/30 uppercase">
          人生日曆
        </p>
        <p className="mb-6 text-sm text-white/40">
          此檢視共 <span className="font-semibold text-white">{cells.length}</span> 格，已過{" "}
          <span className="font-semibold text-white">{lived}</span> 格，剩餘{" "}
          <span className="font-semibold text-white">{cells.length - lived}</span> 格
        </p>

        {/* Unit switcher */}
        <div className="mb-3">
          <p className="mb-2 text-[10px] font-semibold tracking-[0.25em] text-white/30 uppercase">
            檢視單位
          </p>
          <div className="grid grid-cols-4 gap-1 rounded-lg bg-black/30 p-1">
            {(Object.keys(TAB_LABELS) as Granularity[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => selectTab(g)}
                className={`rounded-md py-2 text-xs font-semibold tracking-widest uppercase transition-colors ${
                  tab === g
                    ? "bg-white text-black shadow"
                    : "text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {TAB_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        {/* Breadcrumb (only when drilled) */}
        {isDrilled && (
          <div className="mb-3 flex flex-wrap items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => selectTab(tab)}
              className="rounded-full border border-white/15 px-2.5 py-1 text-white/50 transition-colors hover:border-white/40 hover:text-white"
            >
              ← 回到{TAB_LABELS[tab]}總覽
            </button>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-white/20">›</span>
                <button
                  type="button"
                  onClick={b.onClick}
                  className="rounded-full px-2 py-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {b.label}
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Contextual hint */}
        {hint && <p className="mb-4 text-xs text-amber-300/70">💡 {hint}</p>}

        {isCalendarDay && (
          <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] text-white/40">
            {WEEKDAY_LABELS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        )}

        <motion.div
          key={`${tab}-${drillYear ?? "x"}-${drillMonth ?? "x"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="grid gap-1"
          style={
            cols
              ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
              : { gridTemplateColumns: "repeat(auto-fill, minmax(6px, 1fr))" }
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
                    cell.isCurrent ? "text-black/70 font-semibold" : cell.isPast ? "text-white/70" : "text-black/40"
                  }`}
                >
                  {cell.label}
                </span>
              )}
            </div>
          ))}
        </motion.div>

        <div className="mt-5 flex items-center gap-6 text-xs text-white/40">
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-[2px] border border-black/10 bg-zinc-600" /> 已過去
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-[2px] border border-black/10 bg-white" /> 尚未來到
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-[2px] bg-amber-400 shadow-[0_0_6px_1px_rgba(251,191,36,0.6)]" /> 現在
          </span>
        </div>
      </div>
    </section>
  );
}
