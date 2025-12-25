import { createContext } from 'react'

/**
 * Контекст для глобальной системы нотификаций
 * Предоставляет методы для показа различных типов нотификаций и диалогов подтверждения
 */
export const NotificationContext = createContext({
  // Методы нотификаций
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  showInfo: () => {},
  // Диалог подтверждения
  confirm: () => Promise.resolve(false),
  // Устаревший метод
  showNotification: () => {},
  // Прямой доступ к store
  notificationStore: null,
})
