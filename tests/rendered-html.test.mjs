import assert from "node:assert/strict";
import test from "node:test";
import { performance } from "node:perf_hooks";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, developmentPreviewMeta);
  assert.match(html, /Конструктор исследования/i);
  assert.match(html, /От идеи/);
  assert.match(html, /Аудит готовности/);
});

test("serves the research workflow without a server error", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("workflow-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(new Request("http://localhost/"), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const label of [
    "Логика исследования",
    "Литература и пробел",
    "Переменные и модель",
    "Выборка",
    "Методы",
    "Процедура и прозрачность",
    "План анализа",
    "Этика и данные",
    "Отчёт и защита",
    "Аудит готовности",
    "Справочник",
    "психфак МГУ",
    "Научный сектор психологии",
    "Приватная сессия",
    "Четыре смысловых этапа",
    "Следующие действия",
    "Быстрый старт",
    "Стресс-рецензия",
    "Быстрый переход",
    "Радар проекта",
    "spw · @speway",
  ]) {
    assert.match(html, new RegExp(label, "i"));
  }
  assert.doesNotMatch(html, /НИУ ВШЭ|hse\.ru/i);
  assert.doesNotMatch(html, /протокол(?:а)? № 3 от 28\.09\.2023/i);
  assert.match(html, /Ψ/);
  assert.match(html, /Запрещено основывать работу/);
});

test("выдерживает всплеск из 150 одновременных SSR-запросов", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("burst-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const started = performance.now();
  const responses = await Promise.all(Array.from({ length: 150 }, (_, index) => worker.fetch(new Request(`http://localhost/?stress=${index}`), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} })));
  assert.equal(responses.filter((response) => response.status === 200).length, responses.length);
  const elapsed = performance.now() - started;
  assert.ok(elapsed < 10_000, `150 SSR-запросов заняли ${elapsed.toFixed(1)} мс`);
});
