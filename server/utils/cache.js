import LRUCache from 'lru-cache'

// Создаём кэш с настройками
const cache = new LRUCache({
  max: 500, // максимум 500 записей
  ttl: 1000 * 60 * 5, // 5 минут время жизни
  sizeCalculation: (value) => {
    // Примерный размер в байтах для ограничения памяти
    return JSON.stringify(value).length
  },
  maxSize: 10 * 1024 * 1024, // 10MB максимум
})

/**
 * Получить значение из кэша или вычислить и сохранить
 * @param {string} key - Ключ кэша
 * @param {Function} fetchFn - Функция для получения данных если нет в кэше
 * @returns {Promise<any>} Данные
 */
export const cachedGet = async (key, fetchFn) => {
  const cached = cache.get(key)
  if (cached !== undefined) {
    console.log(`📦 Cache hit: ${key}`)
    return cached
  }

  console.log(`🔍 Cache miss: ${key}`)
  const data = await fetchFn()
  cache.set(key, data)
  return data
}

/**
 * Получить значение из кэша без вычисления
 * @param {string} key - Ключ кэша
 * @returns {any|undefined} Данные или undefined
 */
export const getCache = (key) => {
  return cache.get(key)
}

/**
 * Установить значение в кэш
 * @param {string} key - Ключ кэша
 * @param {any} value - Значение
 */
export const setCache = (key, value) => {
  cache.set(key, value)
}

/**
 * Удалить значение из кэша по ключу
 * @param {string} key - Ключ кэша
 */
export const delCache = (key) => {
  cache.delete(key)
}

/**
 * Удалить значения из кэша по паттерну
 * @param {string} pattern - Паттерн для поиска ключей
 */
export const delCachePattern = (pattern) => {
  let deleted = 0
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
      deleted++
    }
  }
  if (deleted > 0) {
    console.log(`🗑️  Deleted ${deleted} cache entries for pattern: ${pattern}`)
  }
}

/**
 * Инвалидация кэша по паттерну
 * @param {string} pattern - Паттерн для поиска ключей
 */
export const cacheInvalidate = (pattern) => {
  let invalidated = 0
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
      invalidated++
    }
  }
  if (invalidated > 0) {
    console.log(`🗑️  Invalidated ${invalidated} cache entries for pattern: ${pattern}`)
  }
}

/**
 * Очистить весь кэш
 */
export const cacheClear = () => {
  const size = cache.size
  cache.clear()
  console.log(`🗑️  Cleared cache with ${size} entries`)
}

/**
 * Получить статистику кэша
 * @returns {Object} Статистика
 */
export const getCacheStats = () => {
  return {
    size: cache.size,
    maxSize: cache.maxSize,
    sizeInBytes: cache.sizeCalculation ? 'dynamic' : 'N/A',
  }
}
