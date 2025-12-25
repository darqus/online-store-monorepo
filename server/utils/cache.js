// Very small in-memory TTL cache for simple lists
const store = new Map()

export const setCache = (key, value, ttlMs = 30000) => {
  const expiresAt = Date.now() + ttlMs
  store.set(key, { value, expiresAt })
}

export const getCache = (key) => {
  const entry = store.get(key)
  if (!entry) {
    return undefined
  }
  if (entry.expiresAt < Date.now()) {
    store.delete(key)
    return undefined
  }
  return entry.value
}

export const delCache = (key) => {
  store.delete(key)
}

export const clearCache = () => store.clear()
