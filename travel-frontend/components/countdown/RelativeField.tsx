"use client";

import type { RelativeInfo } from "@/lib/lifeExpectancy";

interface Props {
  name: string;
  value: RelativeInfo;
  onChange: (value: RelativeInfo) => void;
}

export default function RelativeField({ name, value, onChange }: Props) {
  function patch(partial: Partial<RelativeInfo>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{name}</p>
        <label className="flex items-center gap-2 text-xs text-white/40">
          <input
            type="checkbox"
            checked={value.skip}
            onChange={(e) => patch({ skip: e.target.checked })}
            className="accent-white"
          />
          不確定，略過
        </label>
      </div>

      {!value.skip && (
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => patch({ alive: true })}
              className={`flex-1 border py-2 text-xs tracking-widest uppercase transition-colors ${
                value.alive
                  ? "border-white bg-white text-black"
                  : "border-white/20 text-white/50 hover:border-white/40"
              }`}
            >
              健在
            </button>
            <button
              type="button"
              onClick={() => patch({ alive: false })}
              className={`flex-1 border py-2 text-xs tracking-widest uppercase transition-colors ${
                !value.alive
                  ? "border-white bg-white text-black"
                  : "border-white/20 text-white/50 hover:border-white/40"
              }`}
            >
              已過世
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="shrink-0 text-xs tracking-widest text-white/40 uppercase">
              {value.alive ? "目前年齡" : "享年"}
            </label>
            <input
              type="number"
              min={0}
              max={120}
              value={value.age}
              onChange={(e) => patch({ age: Number(e.target.value) })}
              className="w-24 border-0 border-b border-white/20 bg-transparent py-1 text-right text-white focus:border-white focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-white/60">
            <input
              type="checkbox"
              checked={value.hasDisease}
              onChange={(e) => patch({ hasDisease: e.target.checked })}
              className="accent-white"
            />
            曾/正罹患重大慢性疾病（心血管疾病、糖尿病、癌症等）
          </label>
        </div>
      )}
    </div>
  );
}
