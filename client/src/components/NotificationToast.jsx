import Alert from 'react-bootstrap/Alert'

/**
 * Компонент тоста нотификации
 * @param {Object} notification - Объект нотификации
 * @param {Function} onClose - Функция закрытия нотификации
 */
const NotificationToast = ({ notification, onClose }) => {
  const { message, type } = notification

  // Маппинг типов на иконки
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'danger':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return 'ℹ'
    }
  }

  return (
    <Alert
      variant={type}
      dismissible
      onClose={onClose}
      className="mb-2"
      style={{
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
      }}
    >
      <div className="d-flex align-items-start">
        <span
          className="me-2"
          style={{
            fontSize: '1.2em',
            fontWeight: 'bold',
            lineHeight: 1,
          }}
        >
          {getIcon(type)}
        </span>
        <div className="flex-grow-1">{message}</div>
      </div>
    </Alert>
  )
}

export default NotificationToast
