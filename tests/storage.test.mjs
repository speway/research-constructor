import test from "node:test";
import assert from "node:assert/strict";
import { APP_STORAGE_KEYS, clearProjectStorage, LEGACY_STORAGE_KEY, STORAGE_KEY } from "../app/storage.ts";

function memoryStorage(entries = []) {
  const values = new Map(entries);
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
}

test("очистка удаляет текущий и прежний ключ, не затрагивая чужие данные", () => {
  const storage = memoryStorage([[STORAGE_KEY, "current"], [LEGACY_STORAGE_KEY, "legacy"], ["another-app", "keep"]]);
  assert.deepEqual(APP_STORAGE_KEYS, [STORAGE_KEY, LEGACY_STORAGE_KEY]);
  assert.equal(clearProjectStorage(storage), true);
  assert.equal(storage.getItem(STORAGE_KEY), null);
  assert.equal(storage.getItem(LEGACY_STORAGE_KEY), null);
  assert.equal(storage.getItem("another-app"), "keep");
});

test("очистка сообщает о неполном удалении", () => {
  const storage = {
    getItem(key) { return key === STORAGE_KEY ? "blocked" : null; },
    removeItem() {},
  };
  assert.equal(clearProjectStorage(storage), false);
});
