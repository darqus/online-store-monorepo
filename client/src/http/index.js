import axios from 'axios'
import { LOCAL_STORAGE_KEYS } from '../utils/consts'
import { handleError } from '../utils/notifications'
import { PersistentStorage } from '../utils/persistentStorage'

// Определяем базовый URL API
const { VITE_API_URL: API_BASE_URL } = import.meta.env

// Создаем экземпляр axios с базовым URL
const $host = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Создаем экземпляр axios с базовым URL для аутентифицированных запросов
const $authHost = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Интерceptor для добавления токена аутентификации к запросам
const authInterceptor = (config) => {
  const token = PersistentStorage.get(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }

  // Удаляем cancelToken из конфигурации, чтобы избежать ошибок
  if (config.cancelToken) {
    delete config.cancelToken
  }

  return config
}

// Добавляем интерсептор к аутентифицированному экземпляру
$authHost.interceptors.request.use(authInterceptor)

// Интерсептор для обработки ошибок
const errorInterceptor = (error) => {
  if (error.response) {
    // Сервер ответил с ошибкой
    const status = error.response.status
    const message = `HTTP ${status}: ${error.response.data?.message || 'Ошибка сервера'}`
    handleError('HTTP', message, error, {
      status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    })
  } else if (error.request) {
    // Запрос был сделан, но ответ не получен
    handleError(
      'HTTP',
      'Ошибка сети: не удалось получить ответ от сервера',
      error,
      {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      }
    )
  } else {
    // Ошибка при настройке запроса
    handleError('HTTP', 'Ошибка при настройке запроса', error, {
      message: error.message,
    })
  }

  return Promise.reject(error)
}

// Добавляем интерсепторы ошибок к обоим экземплярам
$host.interceptors.response.use((response) => response, errorInterceptor)
$authHost.interceptors.response.use((response) => response, errorInterceptor)

export { $authHost, $host }
