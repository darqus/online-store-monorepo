import { jwtDecode } from 'jwt-decode'
import { API_ENDPOINTS } from '../utils/consts'
import { $authHost, $host } from './index'
import { handleError } from '../utils/notifications'

/**
 * Задержка выполнения на указанное количество миллисекунд.
 * @param {number} ms - Количество миллисекунд.
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Обрабатывает ответ аутентификации: проверяет успех и возвращает декодированный токен.
 * Токен автоматически сохраняется в httpOnly cookie на сервере.
 * @param {Object} responseData - Данные ответа от сервера.
 * @returns {Object|null} Декодированный токен или null при неудаче.
 */
const handleAuthResponse = (responseData) => {
  const {
    data: { token },
    success,
  } = responseData

  if (!success) {
    return null
  }

  // Токен уже сохранён в httpOnly cookie на сервере
  // Возвращаем декодированный токен для информации о пользователе
  return jwtDecode(token)
}

/**
 * Регистрирует нового пользователя.
 * @param {string} email - Email пользователя.
 * @param {string} password - Пароль пользователя.
 * @returns {Promise<Object|null>} Декодированный токен или null при ошибке.
 */
export const registration = async (email, password) => {
  let attempt = 0
  const maxAttempts = 3

  while (attempt < maxAttempts) {
    try {
      const response = await $host.post(API_ENDPOINTS.USER.REGISTRATION, {
        email,
        password,
        // Роль не передаем, пусть сервер сам устанавливает роль по умолчанию
      })

      return handleAuthResponse(response.data)
    } catch (error) {
      const { response: { status } = {} } = error

      if (status === 429 && attempt < maxAttempts - 1) {
        const delay = 1000 * 2 ** attempt // 1s, 2s, 4s
        await sleep(delay)
        attempt++
        continue
      }

      if (status === 401 || status === 403) {
        return null
      }

      handleError('Auth', 'Ошибка регистрации пользователя', error, { email })
      throw error
    }
  }
}

/**
 * Авторизует пользователя.
 * @param {string} email - Email пользователя.
 * @param {string} password - Пароль пользователя.
 * @returns {Promise<Object|null>} Декодированный токен или null при ошибке.
 */
export const login = async (email, password) => {
  let attempt = 0
  const maxAttempts = 3

  while (attempt < maxAttempts) {
    try {
      const response = await $host.post(API_ENDPOINTS.USER.LOGIN, {
        email,
        password,
      })

      return handleAuthResponse(response.data)
    } catch (error) {
      const { response: { status } = {} } = error

      if (status === 429 && attempt < maxAttempts - 1) {
        const delay = 1000 * 2 ** attempt // 1s, 2s, 4s
        await sleep(delay)
        attempt++
        continue
      }

      if (status === 401 || status === 403) {
        return null
      }

      handleError('Auth', 'Ошибка входа в систему', error, { email })
      throw error
    }
  }
}

/**
 * Проверяет токен аутентификации.
 * Токен автоматически отправляется в httpOnly cookie.
 * @returns {Promise<Object|null>} Декодированный токен или null при ошибке.
 */
export const check = async () => {
  let attempt = 0
  const maxAttempts = 3

  while (attempt < maxAttempts) {
    try {
      // Используем специальный эндпоинт для проверки токена
      // Токен автоматически отправляется в cookie
      const response = await $authHost.get(API_ENDPOINTS.USER.AUTH)

      return handleAuthResponse(response.data)
    } catch (error) {
      const { response: { status } = {} } = error

      if (status === 429 && attempt < maxAttempts - 1) {
        const delay = 1000 * 2 ** attempt // 1s, 2s, 4s
        await sleep(delay)
        attempt++
        continue
      }

      if (status === 401 || status === 403) {
        // Токен недействителен, возвращаем null
        return null
      }

      handleError('Auth', 'Ошибка проверки аутентификации', error)
      throw error
    }
  }
}
