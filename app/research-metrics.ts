export type RecruitmentInput = {
  targetN: number;
  attritionRate: number;
  invalidRate: number;
  weeklyRate: number;
  participantMinutes: number;
};

export type RecruitmentEstimate = {
  targetN: number;
  invited: number;
  weeks: number;
  participantHours: number;
  attritionRate: number;
  invalidRate: number;
  weeklyRate: number;
};

const finite = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, finite(value, min)));

export function estimateRecruitment(input: RecruitmentInput): RecruitmentEstimate {
  const targetN = Math.round(clamp(input.targetN, 1, 1_000_000));
  const attritionRate = clamp(input.attritionRate, 0, 95);
  const invalidRate = clamp(input.invalidRate, 0, 95);
  const weeklyRate = Math.round(clamp(input.weeklyRate, 1, 1_000_000));
  const participantMinutes = clamp(input.participantMinutes, 0, 600);
  const usableShare = Math.max(.0025, (1 - attritionRate / 100) * (1 - invalidRate / 100));
  const invited = Math.ceil(targetN / usableShare);
  return {
    targetN,
    invited,
    weeks: Math.ceil(invited / weeklyRate),
    participantHours: Math.round(targetN * participantMinutes / 6) / 10,
    attritionRate,
    invalidRate,
    weeklyRate,
  };
}

export function buildRecruitmentStressScenario(input: RecruitmentInput) {
  const base = estimateRecruitment(input);
  const stress = estimateRecruitment({
    ...input,
    attritionRate: clamp(finite(input.attritionRate, 0) + 15, 0, 95),
    invalidRate: clamp(finite(input.invalidRate, 0) + 10, 0, 95),
    weeklyRate: Math.max(1, Math.floor(clamp(input.weeklyRate, 1, 1_000_000) * .7)),
  });
  const pressure = stress.weeks / Math.max(1, base.weeks);
  return {
    base,
    stress,
    pressure,
    level: stress.weeks > 52 || pressure >= 2 ? "critical" : stress.weeks > 24 || pressure >= 1.5 ? "warning" : "stable",
  } as const;
}

export type EvidenceForHealth = {
  citation?: string;
  finding?: string;
  limitation?: string;
  relevance?: string;
  stance?: string;
};

export function evidenceHealth(items: EvidenceForHealth[]) {
  const bounded = items.slice(0, 100);
  const fields = bounded.flatMap((item) => [item.citation, item.finding, item.limitation, item.relevance]);
  const filledFields = fields.filter((value) => typeof value === "string" && value.trim().length >= 8).length;
  const complete = bounded.filter((item) => [item.citation, item.finding, item.limitation, item.relevance].every((value) => typeof value === "string" && value.trim().length >= 8)).length;
  const stances = new Set(bounded.map((item) => item.stance).filter(Boolean));
  return {
    score: fields.length ? Math.round(filledFields / fields.length * 100) : 0,
    complete,
    total: bounded.length,
    hasCounterEvidence: stances.has("contradicts") || stances.has("mixed"),
  };
}

