import { observer } from 'mobx-react-lite'
import { createPortal } from 'react-dom'
import { NotificationContext } from '../contexts/NotificationContext'
import { NotificationStore } from '../stores/NotificationStore'
import { setNotificationStore } from '../utils/notifications'
import ConfirmationDialog from './ConfirmationDialog'
import NotificationToast from './NotificationToast'

const notificationStore = new NotificationStore()

// Инициализируем глобальную утилиту нотификаций
setNotificationStore(notificationStore)

/**
 * Глобальный провайдер системы нотификаций
 * Предоставляет методы для показа различных типов нотификаций и диалогов подтверждения
 */
const NotificationProvider = ({ children }) => {
  /**
   * Показывает нотификацию успеха
   * @param {string} message - Сообщение об успехе
   */
  const showSuccess = (message) => {
    notificationStore.success(message)
  }

  /**
   * Показывает нотификацию ошибки
   * @param {string} message - Сообщение об ошибке
   * @param {Error} error - Объект ошибки
   */
  const showError = (message, error = null) => {
    notificationStore.error(message, error)
  }

  /**
   * Показывает предупреждающую нотификацию
   * @param {string} message - Предупреждающее сообщение
   */
  const showWarning = (message) => {
    notificationStore.warning(message)
  }

  /**
   * Показывает информационную нотификацию
   * @param {string} message - Информационное сообщение
   */
  const showInfo = (message) => {
    notificationStore.info(message)
  }

  /**
   * Показывает диалог подтверждения (замена window.confirm)
   * @param {string} message - Сообщение подтверждения
   * @param {string} title - Заголовок диалога
   * @returns {Promise<boolean>} Promise с результатом подтверждения
   */
  const confirm = async (message, title = 'Подтверждение') => {
    return await notificationStore.showConfirmation(message, title)
  }

  // Устаревший метод для обратной совместимости
  const showNotification = (message, error) => {
    const fullMessage = error ? `${message} ${error.message ?? error}` : message
    const type = error ? 'danger' : 'success'
    notificationStore.addNotification(fullMessage, type)
  }

  const contextValue = {
    // Новые методы
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirm,
    // Устаревший метод
    showNotification,
    // Прямой доступ к store для продвинутых случаев
    notificationStore,
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      {/* Портал для нотификаций */}
      {createPortal(
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1050,
            maxWidth: '90vw',
            width: 'auto',
          }}
        >
          {notificationStore.notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={() =>
                notificationStore.removeNotification(notification.id)
              }
            />
          ))}
        </div>,
        document.body
      )}

      {/* Портал для диалогов подтверждения */}
      {createPortal(
        notificationStore.confirmations.map((confirmation) => (
          <ConfirmationDialog
            key={confirmation.id}
            confirmation={confirmation}
            onConfirm={notificationStore.resolveConfirmation}
            onCancel={notificationStore.cancelConfirmation}
          />
        )),
        document.body
      )}
    </NotificationContext.Provider>
  )
}

export default observer(NotificationProvider)
