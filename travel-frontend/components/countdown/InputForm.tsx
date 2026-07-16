"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RelativeField from "./RelativeField";
import {
  emptyProfile,
  estimateLifeExpectancy,
  type HealthProfile,
  type RelativeInfo,
} from "@/lib/lifeExpectancy";

interface Props {
  onSubmit: (profile: HealthProfile) => void;
  defaultProfile?: HealthProfile;
}

const STEP_TITLES = ["基本資料", "生活習慣", "父母資訊", "祖父母資訊", "預覽結果"];

export default function InputForm({ onSubmit, defaultProfile }: Props) {
  const [profile, setProfile] = useState<HealthProfile>(defaultProfile ?? emptyProfile());
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  function patch(partial: Partial<HealthProfile>) {
    setProfile((p) => ({ ...p, ...partial }));
  }

  function patchRelative(key: keyof HealthProfile, value: RelativeInfo) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function goNext() {
    if (step === 0) {
      if (!profile.birthDate) {
        setError("請輸入你的出生日期");
        return;
      }
      if (new Date(profile.birthDate) > new Date()) {
        setError("出生日期不能在未來");
        return;
      }
    }
    setError("");
    setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  const estimate = estimateLifeExpectancy(profile);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-3 text-xs font-semibold tracking-[0.4em] text-white/30 uppercase"
      >
        生命倒數計時表
      </motion.p>

      <div className="mb-10 flex items-center gap-2">
        {STEP_TITLES.map((title, i) => (
          <div key={title} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                i === step
                  ? "bg-white text-black"
                  : i < step
                  ? "bg-white/30 text-white"
                  : "bg-white/10 text-white/30"
              }`}
            >
              {i + 1}
            </span>
            {i < STEP_TITLES.length - 1 && (
              <span className={`h-px w-6 ${i < step ? "bg-white/40" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-8 text-center text-2xl font-bold text-white">
              {STEP_TITLES[step]}
            </h2>

            {step === 0 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-xs font-medium tracking-widest text-white/40 uppercase">
                    性別
                  </label>
                  <div className="flex gap-2">
                    {(["male", "female"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => patch({ gender: g })}
                        className={`flex-1 border py-3 text-sm tracking-widest uppercase transition-colors ${
                          profile.gender === g
                            ? "border-white bg-white text-black"
                            : "border-white/20 text-white/50 hover:border-white/40"
                        }`}
                      >
                        {g === "male" ? "男性" : "女性"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium tracking-widest text-white/40 uppercase">
                    出生日期
                  </label>
                  <input
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => patch({ birthDate: e.target.value })}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full border-0 border-b border-white/20 bg-transparent py-3 text-lg text-white focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium tracking-widest text-white/40 uppercase">
                      每週運動次數
                    </label>
                    <span className="text-sm font-semibold text-white">
                      {profile.exerciseFrequency} 次/週
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={14}
                    value={profile.exerciseFrequency}
                    onChange={(e) => patch({ exerciseFrequency: Number(e.target.value) })}
                    className="w-full accent-white"
                  />
                  <div className="flex justify-between text-xs text-white/20">
                    <span>0</span>
                    <span>14</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={profile.hasDisease}
                    onChange={(e) => patch({ hasDisease: e.target.checked })}
                    className="accent-white"
                  />
                  本人曾/正罹患重大慢性疾病（心血管疾病、糖尿病、癌症等）
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <RelativeField
                  name="父親"
                  value={profile.father}
                  onChange={(v) => patchRelative("father", v)}
                />
                <RelativeField
                  name="母親"
                  value={profile.mother}
                  onChange={(v) => patchRelative("mother", v)}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <RelativeField
                  name="祖父"
                  value={profile.paternalGrandfather}
                  onChange={(v) => patchRelative("paternalGrandfather", v)}
                />
                <RelativeField
                  name="祖母"
                  value={profile.paternalGrandmother}
                  onChange={(v) => patchRelative("paternalGrandmother", v)}
                />
                <RelativeField
                  name="外祖父"
                  value={profile.maternalGrandfather}
                  onChange={(v) => patchRelative("maternalGrandfather", v)}
                />
                <RelativeField
                  name="外祖母"
                  value={profile.maternalGrandmother}
                  onChange={(v) => patchRelative("maternalGrandmother", v)}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 text-center">
                <p className="text-xs tracking-widest text-white/40 uppercase">
                  根據你提供的資訊，預估壽命為
                </p>
                <p className="text-6xl font-bold text-white">
                  {estimate.value}
                  <span className="ml-2 text-xl text-white/40">歲</span>
                </p>

                <div className="space-y-1 text-left text-xs text-white/40">
                  <div className="flex justify-between">
                    <span>基準值（{profile.gender === "male" ? "男性" : "女性"}）</span>
                    <span>{estimate.base} 歲</span>
                  </div>
                  {estimate.factors.map((f) => (
                    <div key={f.label} className="flex justify-between">
                      <span>{f.label}</span>
                      <span className={f.points > 0 ? "text-emerald-400" : "text-red-400"}>
                        {f.points > 0 ? "+" : ""}
                        {f.points}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-white/20">
                  此數字僅為根據生活型態與家族壽命的粗略估算，非醫療建議。
                </p>
              </div>
            )}

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="flex-1 border border-white/20 py-4 text-sm font-semibold tracking-widest text-white/60 uppercase transition-all hover:border-white/40 hover:text-white"
            >
              上一步
            </button>
          )}
          {step < STEP_TITLES.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex-1 border border-white/20 py-4 text-sm font-semibold tracking-widest text-white uppercase transition-all hover:bg-white hover:text-black"
            >
              下一步
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSubmit(profile)}
              className="flex-1 border border-white/20 py-4 text-sm font-semibold tracking-widest text-white uppercase transition-all hover:bg-white hover:text-black"
            >
              開始倒數
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
