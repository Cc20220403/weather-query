/** LocalStorage 工具函数 */

const STORAGE_PREFIX = 'weather-query-'

/** 安全地读取 LocalStorage */
export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** 安全地写入 LocalStorage */
export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  } catch {
    console.warn(`LocalStorage 写入失败: ${key}`)
  }
}

/** 删除 LocalStorage 中的键 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
  } catch {
    console.warn(`LocalStorage 删除失败: ${key}`)
  }
}
