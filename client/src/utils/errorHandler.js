export const handleError = (showNotification, error) => {
  // Проверяем, что error - это объект, прежде чем обращаться к его свойствам
  let message
  if (error && typeof error === 'object') {
    message =
      error.response?.data?.message ?? error.message ?? 'Неизвестная ошибка'
  } else {
    // Если error - это строка или другой примитив, используем его напрямую
    message = error ?? 'Неизвестная ошибка'
  }

  showNotification(message, error)
}
