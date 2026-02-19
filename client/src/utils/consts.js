/**
 * Роли пользователей системы
 * @readonly
 * @enum {string}
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
}

/**
 * API эндпоинты приложения
 * @readonly
 * @enum {string|object}
 */
export const API_ENDPOINTS = {
  /** Пользовательские операции */
  USER: {
    REGISTRATION: 'user/registration',
    LOGIN: 'user/login',
    AUTH: 'user/auth',
  },
  /** Операции с типами товаров */
  TYPE: 'type',
  /** Операции с брендами */
  BRAND: 'brand',
  /** Операции с устройствами */
  DEVICE: 'device',
  /** Операции с корзиной */
  BASKET: {
    BASE: 'basket',
    ADD: 'basket/add',
    REMOVE: 'basket/remove',
    UPDATE: 'basket/update',
    CLEAR: 'basket/clear',
  },
}

/**
 * Маршруты приложения
 * @readonly
 * @enum {object}
 */
export const ROUTES = {
  /** Защищенные маршруты (требуют авторизации) */
  AUTH: {
    ADMIN: {
      PATH: '/admin',
      TITLE: 'Админ панель',
    },
    BASKET: {
      PATH: '/basket',
      TITLE: 'Корзина',
    },
    CHECKOUT: {
      PATH: '/checkout',
      TITLE: 'Оформление заказа',
    },
  },
  /** Публичные маршруты (доступны без авторизации) */
  PUBLIC: {
    SHOP: {
      PATH: '/shop',
      TITLE: 'Магазин',
    },
    LOGIN: {
      PATH: '/login',
      TITLE: 'Вход',
    },
    REGISTER: {
      PATH: '/register',
      TITLE: 'Регистрация',
    },
    DEVICE: {
      PATH: '/device',
      TITLE: 'Устройство',
    },
  },
}

// Для обратной совместимости
export const AUTH_ROUTES = ROUTES.AUTH
export const PUBLIC_ROUTES = ROUTES.PUBLIC

// =============================================================================
// ФУНКЦИИ ГЕНЕРАЦИИ МЕНЮ
// =============================================================================

/**
 * Генерирует элементы меню для админ панели
 * @param {Function} setTypeVisible - Функция для отображения модального окна типов
 * @param {Function} setBrandVisible - Функция для отображения модального окна брендов
 * @param {Function} setDeviceVisible - Функция для отображения модального окна устройств
 * @returns {Array<Object>} Массив элементов меню
 */
export const getAdminMenu = (
  setTypeVisible,
  setBrandVisible,
  setDeviceVisible
) => [
  {
    id: 1,
    variant: 'outline-dark',
    label: 'Добавить тип',
    onClick: () => setTypeVisible(true),
  },
  {
    id: 2,
    variant: 'outline-dark',
    label: 'Добавить бренд',
    onClick: () => setBrandVisible(true),
  },
  {
    id: 3,
    variant: 'outline-dark',
    label: 'Добавить устройство',
    onClick: () => setDeviceVisible(true),
  },
]

/**
 * Генерирует элементы навигационного меню
 * @param {Function} logOut - Функция для выхода из системы
 * @returns {Object} Объект с массивами элементов меню для авторизованных и неавторизованных пользователей
 */
export const getNavMenuItems = (logOut) => ({
  AUTH: [
    { text: 'Админ панель', path: AUTH_ROUTES.ADMIN.PATH, className: 'me-2' },
    { text: 'Корзина', path: AUTH_ROUTES.BASKET.PATH, className: 'me-2' },
    { text: 'Выйти', path: PUBLIC_ROUTES.LOGIN.PATH, onClick: () => logOut() },
  ],
  NON_AUTH: [
    { text: 'Войти', path: PUBLIC_ROUTES.LOGIN.PATH, className: 'me-2' },
    { text: 'Регистрация', path: PUBLIC_ROUTES.REGISTER.PATH },
  ],
})

// =============================================================================
// КОНТРОЛЫ ФОРМ
// =============================================================================

/**
 * Контролы форм для создания сущностей
 * @readonly
 * @enum {Array<Object>}
 */
export const FORM_CONTROLS = {
  TYPE: [
    {
      id: 'name',
      type: 'text',
      placeholder: 'Введите название типа',
    },
  ],
  BRAND: [
    {
      id: 'name',
      type: 'text',
      placeholder: 'Введите название бренда',
    },
    {
      id: 'country',
      type: 'text',
      placeholder: 'Введите страну бренда',
    },
  ],
  DEVICE: [
    {
      id: 'name',
      type: 'text',
      placeholder: 'Введите название устройства',
    },
    {
      id: 'price',
      type: 'number',
      placeholder: 'Введите стоимость устройства',
    },
    {
      id: 'file',
      type: 'file',
      placeholder: 'Выберите изображение',
      accept: 'image/*',
    },
  ],
}

// Для обратной совместимости
export const DEVICE_FORM_CONTROLS = FORM_CONTROLS.DEVICE
