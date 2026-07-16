export type Gender = "male" | "female";

export interface RelativeInfo {
  skip: boolean;
  alive: boolean;
  age: number;
  hasDisease: boolean;
}

export interface HealthProfile {
  gender: Gender;
  birthDate: string;
  exerciseFrequency: number;
  hasDisease: boolean;
  father: RelativeInfo;
  mother: RelativeInfo;
  paternalGrandfather: RelativeInfo;
  paternalGrandmother: RelativeInfo;
  maternalGrandfather: RelativeInfo;
  maternalGrandmother: RelativeInfo;
}

export function emptyRelative(defaultAge: number): RelativeInfo {
  return { skip: false, alive: true, age: defaultAge, hasDisease: false };
}

export function emptyProfile(): HealthProfile {
  return {
    gender: "male",
    birthDate: "",
    exerciseFrequency: 2,
    hasDisease: false,
    father: emptyRelative(65),
    mother: emptyRelative(65),
    paternalGrandfather: emptyRelative(80),
    paternalGrandmother: emptyRelative(80),
    maternalGrandfather: emptyRelative(80),
    maternalGrandmother: emptyRelative(80),
  };
}

const BASE_LIFE_EXPECTANCY: Record<Gender, number> = {
  male: 77,
  female: 84,
};

export interface ScoreFactor {
  label: string;
  points: number;
}

export interface LifeExpectancyEstimate {
  value: number;
  base: number;
  factors: ScoreFactor[];
}

function exerciseAdjustment(timesPerWeek: number): ScoreFactor {
  if (timesPerWeek <= 0) return { label: "幾乎不運動", points: -3 };
  if (timesPerWeek <= 2) return { label: "偶爾運動", points: 0 };
  if (timesPerWeek <= 4) return { label: "規律運動", points: 1.5 };
  return { label: "高頻率運動", points: 3 };
}

function relativeAdjustment(name: string, r: RelativeInfo, weight: number): ScoreFactor | null {
  if (r.skip) return null;
  let points = 0;
  if (r.alive) {
    if (r.age >= 90) points += 2;
    else if (r.age >= 80) points += 1;
  } else {
    if (r.age < 60) points -= 2.5;
    else if (r.age < 75) points -= 1;
    else if (r.age >= 90) points += 1.5;
  }
  if (r.hasDisease) points -= 0.5;
  points *= weight;
  if (points === 0) return null;
  return { label: name, points: Math.round(points * 10) / 10 };
}

export function estimateLifeExpectancy(profile: HealthProfile): LifeExpectancyEstimate {
  const base = BASE_LIFE_EXPECTANCY[profile.gender];
  const factors: ScoreFactor[] = [exerciseAdjustment(profile.exerciseFrequency)];

  if (profile.hasDisease) {
    factors.push({ label: "本人有慢性疾病", points: -5 });
  }

  const relatives: [string, RelativeInfo, number][] = [
    ["父親", profile.father, 1.5],
    ["母親", profile.mother, 1.5],
    ["祖父", profile.paternalGrandfather, 0.75],
    ["祖母", profile.paternalGrandmother, 0.75],
    ["外祖父", profile.maternalGrandfather, 0.75],
    ["外祖母", profile.maternalGrandmother, 0.75],
  ];

  for (const [name, info, weight] of relatives) {
    const factor = relativeAdjustment(name, info, weight);
    if (factor) factors.push(factor);
  }

  const total = factors.reduce((sum, f) => sum + f.points, 0);
  const value = Math.round(Math.min(110, Math.max(40, base + total)) * 10) / 10;

  return { value, base, factors: factors.filter((f) => f.points !== 0) };
}
