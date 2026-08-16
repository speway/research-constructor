export const STORAGE_KEY = "research-constructor-project-v2";
export const LEGACY_STORAGE_KEY = "research-constructor-project-v1";
export const APP_STORAGE_KEYS = [STORAGE_KEY, LEGACY_STORAGE_KEY] as const;

type StorageLike = Pick<Storage, "getItem" | "removeItem">;

export function clearProjectStorage(storage: StorageLike) {
  for (const key of APP_STORAGE_KEYS) storage.removeItem(key);
  return APP_STORAGE_KEYS.every((key) => storage.getItem(key) === null);
}
