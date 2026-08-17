import assert from "node:assert/strict";
import test from "node:test";
import { performance } from "node:perf_hooks";
import { analyzeTopic, findRepeatedIdentifierPath, findRestrictedDatasetPath } from "../app/research-logic.ts";

test("анализ темы ограничивает сверхдлинный ввод и остаётся быстрым", () => {
  const huge = `влияние ${"связь регуляции эмоций со стрессом у студентов ".repeat(25_000)}`;
  const started = performance.now();
  const result = analyzeTopic(huge, "universal", "correlational");
  const elapsed = performance.now() - started;
  assert.ok(result.wordCount > 0);
  assert.equal(result.signals.find((signal) => signal.id === "causality")?.ok, false);
  assert.ok(elapsed < 1_500, `анализ занял ${elapsed.toFixed(1)} мс`);
});

test("сканер импорта выдерживает циклы, глубину и широкие объекты", () => {
  const cyclic = { title: "Проект" };
  cyclic.self = cyclic;
  assert.equal(findRestrictedDatasetPath(cyclic), null);

  let deep = { title: "Проект" };
  for (let index = 0; index < 20; index += 1) deep = { child: deep };
  assert.match(findRestrictedDatasetPath(deep) ?? "", /слишком сложная структура/);

  const wide = Object.fromEntries(Array.from({ length: 10_050 }, (_, index) => [`field${index}`, index]));
  assert.match(findRestrictedDatasetPath(wide) ?? "", /слишком сложная структура/);
});

test("сканер идентификаторов допускает служебный контакт, но блокирует список", () => {
  assert.equal(findRepeatedIdentifierPath({ supervisor: "researcher@example.org", consent: "Вопросы: +998 90 123 45 67" }), null);
  const path = findRepeatedIdentifierPath({ notes: "a@example.org, b@example.org, c@example.org" });
  assert.match(path ?? "", /notes/);
});

test("fuzz-сканирование не пропускает запрещённые контейнеры и не падает", () => {
  const started = performance.now();
  for (let index = 0; index < 10_000; index += 1) {
    const payload = {
      title: `Проект ${index}`,
      plan: [{ step: "question", value: index }, { step: "method", nested: { ok: true } }],
      ...(index % 17 === 0 ? { respondent_data: [{ id: index }] } : {}),
    };
    const result = findRestrictedDatasetPath(payload);
    if (index % 17 === 0) assert.match(result ?? "", /respondent_data/);
    else assert.equal(result, null);
  }
  const elapsed = performance.now() - started;
  assert.ok(elapsed < 2_000, `fuzz-проверка заняла ${elapsed.toFixed(1)} мс`);
});
