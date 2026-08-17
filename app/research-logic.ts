export type TopicProfile = "universal" | "msu-branch" | "article";

export type TopicSignal = {
  id: string;
  ok: boolean;
  label: string;
  advice: string;
};

const causalPattern = /(влия(ет|ние)|вызывает|приводит|определяет|причин|эффект)/i;
const fillerPattern = /\b(исследовани[ея]|изучени[ея])\b/i;
const relationPattern = /(связ|различ|динамик|механизм|предиктор|услови|роль|структур|пережив|отношен)/i;
const contextPattern = /(у\s+|среди\s+|в\s+условиях|на\s+выборке|студент|подрост|взросл|дет|работник|специалист)/i;

export function analyzeTopic(topic: string, profile: TopicProfile, design: string): { score: number; wordCount: number; signals: TopicSignal[] } {
  const clean = topic.slice(0, 20_000).trim().replace(/\s+/g, " ");
  const wordCount = clean ? clean.split(" ").length : 0;
  const focusedLimit = profile === "msu-branch" ? 11 : profile === "article" ? 18 : 22;
  const signals: TopicSignal[] = [
    { id: "substance", ok: clean.length >= 16, label: "Есть содержательная формулировка", advice: "Назовите психологический феномен и исследовательское отношение." },
    { id: "relation", ok: relationPattern.test(clean), label: "Видна исследовательская логика", advice: "Покажите связь, различие, механизм, динамику или структуру." },
    { id: "context", ok: contextPattern.test(clean), label: "Обозначены границы", advice: "Уточните группу, ситуацию или контекст, если это важно для вывода." },
    { id: "focus", ok: wordCount > 0 && wordCount <= focusedLimit, label: `Фокус удерживается (до ${focusedLimit} слов)`, advice: "Уберите необязательные обороты; подробности перенесите в вопрос и выборку." },
    { id: "causality", ok: !causalPattern.test(clean) || design === "experimental", label: "Язык соответствует дизайну", advice: "Без рандомизированного воздействия используйте язык связи, различий или прогноза." },
  ];
  if (profile === "msu-branch") {
    signals.push({ id: "local-style", ok: !fillerPattern.test(clean), label: "Локальный стиль темы", advice: "Для учебного профиля уберите слова «изучение» и «исследование»." });
  }
  return { score: Math.round(signals.filter((signal) => signal.ok).length / signals.length * 100), wordCount, signals };
}

const datasetKeys = new Set([
  "participants", "participantdata", "respondents", "respondentdata", "responses", "answers", "dataset", "rows",
  "emails", "phones", "contacts", "fullnames", "medicaldata", "identifiers", "rawdata", "subjects",
]);

const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-zа-яё]/gi, "");

export function findRestrictedDatasetPath(value: unknown): string | null {
  const stack: Array<{ value: unknown; path: string; depth: number }> = [{ value, path: "project", depth: 0 }];
  const seen = new WeakSet<object>();
  let visited = 0;
  while (stack.length) {
    const current = stack.pop()!;
    visited += 1;
    if (visited > 10_000 || current.depth > 12) return `${current.path} (слишком сложная структура)`;
    if (!current.value || typeof current.value !== "object") continue;
    if (seen.has(current.value)) continue;
    seen.add(current.value);
    if (Array.isArray(current.value)) {
      if (current.value.length > 500) return `${current.path} (массив из ${current.value.length} записей)`;
      current.value.forEach((entry, index) => stack.push({ value: entry, path: `${current.path}[${index}]`, depth: current.depth + 1 }));
      continue;
    }
    for (const [key, entry] of Object.entries(current.value as Record<string, unknown>)) {
      const normalized = normalizeKey(key);
      if (datasetKeys.has(normalized)) return `${current.path}.${key}`;
      stack.push({ value: entry, path: `${current.path}.${key}`, depth: current.depth + 1 });
    }
  }
  return null;
}

export function experimentReadiness(fields: Record<string, string | string[]>): { score: number; missing: string[] } {
  const checks: Array<[string, boolean]> = [
    ["манипуляция и уровни", String(fields.manipulation || "").trim().length >= 12],
    ["контрольное условие", String(fields.controlCondition || "").trim().length >= 8],
    ["распределение", String(fields.assignmentPlan || "").trim().length >= 12],
    ["последовательность / контрбалансировка", String(fields.counterbalancing || "").trim().length >= 8],
    ["проверка манипуляции", String(fields.manipulationCheck || "").trim().length >= 8],
    ["верность реализации", String(fields.fidelityPlan || "").trim().length >= 8],
    ["правила качества", String(fields.qualityRules || "").trim().length >= 8],
    ["контроль угроз валидности", Array.isArray(fields.experimentControls) && fields.experimentControls.length >= 4],
  ];
  const missing = checks.filter(([, ok]) => !ok).map(([label]) => label);
  return { score: Math.round((checks.length - missing.length) / checks.length * 100), missing };
}
