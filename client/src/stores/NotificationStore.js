import { makeAutoObservable } from 'mobx'

/**
 * Типы нотификаций
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'danger',
  WARNING: 'warning',
  INFO: 'info',
}

/**
 * Стор для управления нотификациями и диалогами подтверждения
 */
export class NotificationStore {
  constructor() {
    this._notifications = []
    this._confirmations = []
    this._recentNotifications = new Map() // Хранит последние нотификации для дедупликации
    makeAutoObservable(this)
  }

  /**
   * Добавляет новую нотификацию
   * @param {string} message - Сообщение нотификации
   * @param {string} type - Тип нотификации (success, danger, warning, info)
   * @param {number} duration - Длительность показа в миллисекундах (по умолчанию 5000)
   */
  addNotification = (
    message,
    type = NOTIFICATION_TYPES.INFO,
    duration = 5000
  ) => {
    if (!message || typeof message !== 'string') {
      console.warn('Notification message must be a non-empty string')
      return
    }

    // Генерируем уникальный ключ для дедупликации на основе сообщения и типа
    const dedupeKey = `${message}_${type}`
    const now = Date.now()
    const cooldownPeriod = 1000 // 1 секунда для дедупликации

    // Проверяем, была ли недавно показана такая же нотификация
    if (this._recentNotifications.has(dedupeKey)) {
      const lastShownTime = this._recentNotifications.get(dedupeKey)
      // Если прошло менее 1 секунды с последнего показа, не добавляем
      if (now - lastShownTime < cooldownPeriod) {
        return
      }
    }

    const id = Date.now() + Math.random()
    this._notifications.push({ id, message, type, duration })

    // Обновляем время последнего показа этой нотификации
    this._recentNotifications.set(dedupeKey, now)

    // Удаляем запись из кэша через 1 секунду
    setTimeout(() => {
      this._recentNotifications.delete(dedupeKey)
    }, cooldownPeriod)

    // Удаляем нотификацию автоматически
    if (duration > 0) {
      setTimeout(() => this.removeNotification(id), duration)
    }
  }

  /**
   * Добавляет нотификацию об успехе
   * @param {string} message - Сообщение об успехе
   */
  success = (message) => {
    this.addNotification(message, NOTIFICATION_TYPES.SUCCESS)
  }

  /**
   * Добавляет нотификацию об ошибке
   * @param {string} message - Сообщение об ошибке
   * @param {Error} error - Объект ошибки для дополнительной информации
   */
  error = (message, error = null) => {
    const fullMessage = error
      ? `${message}: ${error.message || error}`
      : message
    this.addNotification(fullMessage, NOTIFICATION_TYPES.ERROR, 7000)
  }

  /**
   * Добавляет предупреждающую нотификацию
   * @param {string} message - Предупреждающее сообщение
   */
  warning = (message) => {
    this.addNotification(message, NOTIFICATION_TYPES.WARNING)
  }

  /**
   * Добавляет информационную нотификацию
   * @param {string} message - Информационное сообщение
   */
  info = (message) => {
    this.addNotification(message, NOTIFICATION_TYPES.INFO)
  }

  /**
   * Удаляет нотификацию по ID
   * @param {string} id - ID нотификации
   */
  removeNotification = (id) => {
    this._notifications = this._notifications.filter((n) => n.id !== id)
  }

  /**
   * Очищает все нотификации
   */
  clearAllNotifications = () => {
    this._notifications = []
  }

  /**
   * Показывает диалог подтверждения
   * @param {string} message - Сообщение подтверждения
   * @param {string} title - Заголовок диалога (опционально)
   * @returns {Promise<boolean>} Promise, который разрешается с true/false
   */
  showConfirmation = (message, title = 'Подтверждение') => {
    return new Promise((resolve) => {
      const id = Date.now() + Math.random()
      this._confirmations.push({
        id,
        title,
        message,
        resolve,
      })
    })
  }

  /**
   * Подтверждает диалог подтверждения
   * @param {string} id - ID подтверждения
   * @param {boolean} confirmed - Результат подтверждения
   */
  resolveConfirmation = (id, confirmed) => {
    const confirmation = this._confirmations.find((c) => c.id === id)
    if (confirmation) {
      confirmation.resolve(confirmed)
      this._confirmations = this._confirmations.filter((c) => c.id !== id)
    }
  }

  /**
   * Отменяет диалог подтверждения
   * @param {string} id - ID подтверждения
   */
  cancelConfirmation = (id) => {
    this.resolveConfirmation(id, false)
  }

  /**
   * Получает список активных нотификаций
   * @returns {Array} Массив нотификаций
   */
  get notifications() {
    return this._notifications
  }

  /**
   * Получает список активных диалогов подтверждения
   * @returns {Array} Массив подтверждений
   */
  get confirmations() {
    return this._confirmations
  }
}
