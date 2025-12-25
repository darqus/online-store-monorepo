/**
 * Глобальная утилита для показа нотификаций вне React компонентов
 * Используется в API модулях, stores и других местах без доступа к контексту
 */

let notificationStore = null

/**
 * Устанавливает ссылку на notification store для глобального доступа
 * @param {NotificationStore} store - Экземпляр NotificationStore
 */
export const setNotificationStore = (store) => {
  notificationStore = store
}

/**
 * Показывает нотификацию об успехе
 * @param {string} message - Сообщение об успехе
 */
export const showSuccess = (message) => {
  if (notificationStore) {
    notificationStore.success(message)
  } else {
    console.warn('Notification store not initialized:', message)
  }
}

/**
 * Показывает нотификацию об ошибке
 * @param {string} message - Сообщение об ошибке
 * @param {Error} error - Объект ошибки для дополнительной информации
 */
export const showError = (message, error = null) => {
  if (notificationStore) {
    notificationStore.error(message, error)
  } else {
    console.warn('Notification store not initialized. Error:', message, error)
  }
}

/**
 * Показывает предупреждающую нотификацию
 * @param {string} message - Предупреждающее сообщение
 */
export const showWarning = (message) => {
  if (notificationStore) {
    notificationStore.warning(message)
  } else {
    console.warn('Notification store not initialized:', message)
  }
}

/**
 * Показывает информационную нотификацию
 * @param {string} message - Информационное сообщение
 */
export const showInfo = (message) => {
  if (notificationStore) {
    notificationStore.info(message)
  } else {
    console.warn('Notification store not initialized:', message)
  }
}

/**
 * Показывает диалог подтверждения (только для использования в React компонентах)
 * @param {string} message - Сообщение подтверждения
 * @param {string} title - Заголовок диалога
 * @returns {Promise<boolean>} Promise с результатом подтверждения
 */
export const confirm = async (message, title = 'Подтверждение') => {
  if (notificationStore) {
    return await notificationStore.showConfirmation(message, title)
  } else {
    console.warn('Notification store not initialized for confirmation')
    return false
  }
}

/**
 * Глобальный обработчик ошибок для замены console.error
 * @param {string} context - Контекст ошибки (например, 'API', 'Store', 'Component')
 * @param {string} message - Сообщение об ошибке
 * @param {Error} error - Объект ошибки
 * @param {Object} additionalData - Дополнительные данные для логирования
 */
export const handleError = (
  context,
  message,
  error = null,
  additionalData = null
) => {
  // Показываем нотификацию пользователю
  showError(message, error)

  // Логируем в консоль для разработчиков (только в development)
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 ${context} Error`)
    console.error(message, error)
    if (additionalData) {
      console.log('Additional data:', additionalData)
    }
    console.groupEnd()
  }
}
