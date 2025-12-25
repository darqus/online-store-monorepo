import { handleError } from './notifications'

/**
 * @typedef {any} StorageValue
 */

/**
 * Объект для работы с localStorage
 */
export const PersistentStorage = {
  /**
   * Сохраняет значение в localStorage
   * @param {string} key - Ключ
   * @param {StorageValue} value - Значение
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      handleError('Storage', 'Ошибка сохранения данных в localStorage', error, {
        key,
      })
    }
  },

  /**
   * Получает значение из localStorage
   * @param {string} key - Ключ
   * @returns {StorageValue|null} Значение или null
   */
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      handleError('Storage', 'Ошибка чтения данных из localStorage', error, {
        key,
      })
      return null
    }
  },

  /**
   * Удаляет значение из localStorage
   * @param {string} key - Ключ
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      handleError('Storage', 'Ошибка удаления данных из localStorage', error, {
        key,
      })
    }
  },

  /**
   * Очищает весь localStorage
   */
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      handleError('Storage', 'Ошибка очистки localStorage', error)
    }
  },
}
