import { API_ENDPOINTS } from '../utils/consts'
import { handleError } from '../utils/notifications'
import { $authHost } from './index'

/**
 * API methods for basket operations
 */

/**
 * API methods for basket operations
 */
export const basketAPI = {
  /**
   * Get user's basket
   * @returns {Promise<Object>} Basket data
   */
  async getBasket() {
    const { data } = await $authHost.get(API_ENDPOINTS.BASKET.BASE)
    return data
  },

  /**
   * Add device to basket
   * @param {number} deviceId - Device ID to add
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Response data
   */
  async addToBasket(deviceId, quantity = 1) {
    const { data } = await $authHost.post(API_ENDPOINTS.BASKET.ADD, {
      deviceId,
      quantity,
    })
    return data
  },

  /**
   * Remove item from basket
   * @param {number} deviceId - Device ID to remove
   * @returns {Promise<Object>} Response data
   */
  async removeFromBasket(deviceId) {
    const { data } = await $authHost.delete(
      `${API_ENDPOINTS.BASKET.REMOVE}/${deviceId}`
    )
    return data
  },

  /**
   * Update quantity of item in basket
   * @param {number} deviceId - Device ID to update
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Response data
   */
  async updateBasketQuantity(deviceId, quantity) {
    try {
      const { data } = await $authHost.put(
        `${API_ENDPOINTS.BASKET.UPDATE}/${deviceId}`,
        {
          quantity,
        }
      )
      return data
    } catch (error) {
      handleError(
        'BasketAPI',
        'Ошибка при обновлении количества товара в корзине',
        error,
        {
          deviceId,
          quantity,
          url: `${API_ENDPOINTS.BASKET.UPDATE}/${deviceId}`,
        }
      )
      throw error
    }
  },

  /**
   * Clear all items from basket
   * @returns {Promise<Object>} Response data
   */
  async clearAllBasket() {
    try {
      const { data } = await $authHost.delete(API_ENDPOINTS.BASKET.CLEAR)
      return data
    } catch (error) {
      handleError('BasketAPI', 'Ошибка при очистке корзины', error, {
        url: API_ENDPOINTS.BASKET.CLEAR,
      })
      throw error
    }
  },
}
