import assert from "node:assert/strict";
import test from "node:test";
import { analyzeTopic, experimentReadiness, findRestrictedDatasetPath } from "../app/research-logic.ts";

test("универсальный профиль не превращает локальный лимит слов в закон", () => {
  const topic = "Связь стратегий когнитивной регуляции эмоций с академическим стрессом у студентов первого курса";
  const universal = analyzeTopic(topic, "universal", "correlational");
  const local = analyzeTopic(topic, "msu-branch", "correlational");
  assert.ok(universal.score > local.score);
  assert.equal(universal.signals.some((signal) => signal.id === "local-style"), false);
  assert.equal(local.signals.some((signal) => signal.id === "local-style"), true);
});

test("причинный язык без эксперимента получает предупреждение", () => {
  const observational = analyzeTopic("Влияние обратной связи на тревогу у студентов", "universal", "correlational");
  const experimental = analyzeTopic("Влияние обратной связи на тревогу у студентов", "universal", "experimental");
  assert.equal(observational.signals.find((signal) => signal.id === "causality")?.ok, false);
  assert.equal(experimental.signals.find((signal) => signal.id === "causality")?.ok, true);
});

test("импорт блокирует наборы данных участников, но принимает план", () => {
  assert.equal(findRestrictedDatasetPath({ title: "План", tasks: ["Сформулировать вопрос"] }), null);
  assert.match(findRestrictedDatasetPath({ title: "Опасный импорт", participants: [{ name: "А." }] }) ?? "", /participants/);
  assert.match(findRestrictedDatasetPath({ dataset: Array.from({ length: 501 }, (_, i) => i) }) ?? "", /dataset/);
});

test("готовность эксперимента отражает заполнение критических элементов", () => {
  const empty = experimentReadiness({});
  const ready = experimentReadiness({ manipulation: "Два уровня фактора", controlCondition: "Нейтральное условие", assignmentPlan: "Случайное распределение", counterbalancing: "Порядок AB и BA", manipulationCheck: "Отдельная оценка условия", fidelityPlan: "Чек-лист ведущего", qualityRules: "Минимальная точность 70%", experimentControls: ["a", "b", "c", "d"] });
  assert.equal(empty.score, 0);
  assert.equal(ready.score, 100);
});
