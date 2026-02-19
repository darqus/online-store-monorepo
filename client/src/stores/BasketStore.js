import { action, makeAutoObservable, runInAction } from 'mobx'
import { basketAPI } from '../http/basketAPI'
import {
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from '../utils/notifications'

class BasketStore {
  basket = []
  isLoading = false
  isLoaded = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  // Observable basket items
  get items() {
    return this.basket
  }

  // Computed total price with validation
  get totalPrice() {
    return this.basket.reduce((total, item) => {
      const price = Number(item?.device?.price) || 0
      const quantity = Number(item?.quantity) || 1

      return total + Math.max(0, price) * Math.max(1, quantity)
    }, 0)
  }

  // Computed total quantity with validation
  get totalQuantity() {
    return this.basket.reduce((total, item) => {
      const quantity = Number(item?.quantity) || 1
      return total + Math.max(1, quantity)
    }, 0)
  }

  // Load basket from server
  async loadBasket() {
    // Avoid multiple simultaneous requests
    if (this.isLoading) {
      return
    }

    try {
      this.isLoading = true
      const response = await basketAPI.getBasket()
      // Сервер возвращает { id, userId, devices: [...] }
      const devices = response.data?.devices || []

      // Just sanitize data without strict validation
      const sanitizedDevices = devices.map((item) => {
        const sanitizedItem = { ...item }

        // Ensure device exists
        if (!item.device) {
          sanitizedItem.device = { name: 'Без названия', price: 0 }
        }

        // Ensure device has valid name
        if (!item.device.name) {
          sanitizedItem.device = {
            ...sanitizedItem.device,
            name: 'Без названия',
          }
        }

        // Ensure price is a valid number
        const price = Number(item.device.price)
        sanitizedItem.device = {
          ...sanitizedItem.device,
          price: Number.isNaN(price) || price < 0 ? 0 : price,
        }

        // Ensure quantity is a valid number, default to 1
        const quantity = Number(item.quantity)
        sanitizedItem.quantity =
          Number.isNaN(quantity) || quantity <= 0 ? 1 : Math.floor(quantity)

        return sanitizedItem
      })

      runInAction(() => {
        this.basket = sanitizedDevices
        this.isLoaded = true
      })
    } catch (error) {
      showError(
        'Не удалось загрузить корзину. Попробуйте обновить страницу.',
        error
      )
      throw error
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // Add item to basket
  async addItem(deviceId, quantity = 1) {
    // Validate input parameters
    if (!deviceId || typeof deviceId !== 'number') {
      const error = new Error('Invalid device ID')
      showError('Неверный ID товара')
      throw error
    }

    const validQuantity = Number(quantity)
    if (Number.isNaN(validQuantity) || validQuantity <= 0) {
      const error = new Error('Invalid quantity')
      showError('Неверное количество товара')
      throw error
    }

    try {
      runInAction(() => {
        this.isLoading = true
      })
      const response = await basketAPI.addToBasket(deviceId, quantity)

      // Update local basket with the new item
      const newItem = {
        ...response.data,
        quantity: response.data.quantity || quantity || 1,
      }
      runInAction(() => {
        const existingItemIndex = this.basket.findIndex(
          (item) => item.deviceId === deviceId
        )

        if (existingItemIndex !== -1) {
          // Update existing item
          this.basket[existingItemIndex] = newItem
          showSuccess(
            `Количество товара "${newItem.device?.name || 'Товар'}" обновлено`
          )
        } else {
          // Add new item
          this.basket.push(newItem)
          showSuccess(
            `Товар "${newItem.device?.name || 'Товар'}" добавлен в корзину`
          )
        }

        // MobX автоматически отслеживает изменения массива
      })
    } catch (error) {
      showError(
        'Не удалось добавить товар в корзину. Попробуйте еще раз.',
        error
      )
      throw error
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // Remove item from basket
  async removeItem(deviceId) {
    // Validate input parameters
    if (!deviceId || typeof deviceId !== 'number') {
      const error = new Error('Invalid device ID')
      showError('Неверный ID товара')
      throw error
    }

    try {
      runInAction(() => {
        this.isLoading = true
      })
      await basketAPI.removeFromBasket(deviceId)

      // Remove item from local basket
      const itemToRemove = this.basket.find(
        (item) => item.deviceId === deviceId
      )
      runInAction(() => {
        const itemIndex = this.basket.findIndex(
          (item) => item.deviceId === deviceId
        )
        if (itemIndex !== -1) {
          this.basket.splice(itemIndex, 1)
        }
        showInfo(
          `Товар "${itemToRemove?.device?.name || 'Товар'}" удален из корзины`
        )
      })
    } catch (error) {
      showError(
        'Не удалось удалить товар из корзины. Попробуйте еще раз.',
        error
      )
      throw error
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // Update item quantity
  async updateQuantity(deviceId, quantity) {
    // Validate input parameters
    if (!deviceId || typeof deviceId !== 'number') {
      const error = new Error('Invalid device ID')
      showError('Неверный ID товара')
      throw error
    }

    // Проверяем, что quantity - корректное число
    const validQuantity = Number(quantity)
    if (Number.isNaN(validQuantity) || validQuantity <= 0) {
      // If quantity is 0, less than 0, or NaN, remove the item
      return this.removeItem(deviceId)
    }

    try {
      runInAction(() => {
        this.isLoading = true
      })
      const response = await basketAPI.updateBasketQuantity(
        deviceId,
        validQuantity
      )

      // Update the item in local basket
      runInAction(() => {
        const itemIndex = this.basket.findIndex(
          (item) => item.deviceId === deviceId
        )
        if (itemIndex !== -1) {
          // Ensure response.data has valid quantity
          const updatedItem = {
            ...response.data,
            quantity: response.data.quantity || quantity || 1,
          }
          this.basket[itemIndex] = updatedItem
          showSuccess(
            `Количество товара "${updatedItem.device?.name || 'Товар'}" изменено на ${quantity}`
          )
        }
      })
    } catch (error) {
      showError(
        'Не удалось изменить количество товара. Попробуйте еще раз.',
        error
      )
      throw error
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // Clear all items from basket with backend sync
  async clearAllItems() {
    // Validate that basket is not empty
    if (this.basket.length === 0) {
      showWarning('Корзина уже пуста')
      return
    }

    try {
      runInAction(() => {
        this.isLoading = true
      })

      await basketAPI.clearAllBasket()

      // Clear local basket after successful API call
      runInAction(() => {
        this.basket = []
        showSuccess('Корзина успешно очищена')
      })
    } catch (error) {
      showError('Не удалось очистить корзину. Попробуйте еще раз.', error)
      throw error
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // Clear basket locally (without API call)
  clearBasket = action(() => {
    runInAction(() => {
      this.basket = []
    })
  })

  // Check if item exists in basket
  hasItem(deviceId) {
    return this.basket.some((item) => item.deviceId === deviceId)
  }

  // Get item by device ID
  getItemByDeviceId(deviceId) {
    return this.basket.find((item) => item.deviceId === deviceId)
  }

  // Get item quantity by device ID
  getQuantityByDeviceId(deviceId) {
    const item = this.getItemByDeviceId(deviceId)
    return item ? item.quantity : 0
  }
}

// Create and export singleton instance
const basketStore = new BasketStore()
export { basketStore }
