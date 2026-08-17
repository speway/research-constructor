import assert from "node:assert/strict";
import test from "node:test";
import { performance } from "node:perf_hooks";
import { buildRecruitmentStressScenario, estimateRecruitment, evidenceHealth } from "../app/research-metrics.ts";

test("симулятор набора учитывает отсев и непригодные наблюдения", () => {
  const estimate = estimateRecruitment({ targetN: 120, attritionRate: 20, invalidRate: 10, weeklyRate: 30, participantMinutes: 25 });
  assert.equal(estimate.invited, 167);
  assert.equal(estimate.weeks, 6);
  assert.equal(estimate.participantHours, 50);
});

test("стресс-сценарий всегда тяжелее базового и сохраняет конечные значения", () => {
  const started = performance.now();
  for (let index = 0; index < 20_000; index += 1) {
    const scenario = buildRecruitmentStressScenario({
      targetN: index % 137 === 0 ? Number.POSITIVE_INFINITY : (index * 7919) % 2_000_000,
      attritionRate: (index * 17) % 180 - 40,
      invalidRate: (index * 29) % 170 - 35,
      weeklyRate: (index * 13) % 2_000_000,
      participantMinutes: (index * 7) % 900,
    });
    for (const value of [scenario.base.invited, scenario.base.weeks, scenario.base.participantHours, scenario.stress.invited, scenario.stress.weeks]) assert.ok(Number.isFinite(value));
    assert.ok(scenario.base.invited >= scenario.base.targetN);
    assert.ok(scenario.stress.invited >= scenario.base.invited);
    assert.ok(scenario.stress.weeks >= scenario.base.weeks);
  }
  const elapsed = performance.now() - started;
  assert.ok(elapsed < 2_000, `20 000 сценариев заняли ${elapsed.toFixed(1)} мс`);
});

test("матрица доказательств отличает заполненность от контраргумента", () => {
  const sources = [
    { citation: "Автор, 2024", finding: "Связь обнаружена", limitation: "Один срез", relevance: "Поддерживает гипотезу", stance: "supports" },
    { citation: "Автор, 2023", finding: "Эффект нестабилен", limitation: "Малая выборка", relevance: "Ограничивает вывод", stance: "mixed" },
  ];
  const health = evidenceHealth(sources);
  assert.equal(health.complete, 2);
  assert.equal(health.score, 100);
  assert.equal(health.hasCounterEvidence, true);
});

