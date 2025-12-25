import basketService from '../services/basketService.js'
import ApiError from '../error/ApiError.js'
import { ok } from '../utils/respond.js'

class BasketController {
  async getBasket(req, res, next) {
    try {
      const userId = req.user.id
      const basket = await basketService.getBasket(userId)

      return ok(res, basket)
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }

  async addDevice(req, res, next) {
    try {
      const userId = req.user.id
      const { deviceId, quantity = 1 } = req.body

      // Проверяем, что deviceId предоставлен
      if (!deviceId) {
        return next(ApiError.badRequest('deviceId is required'))
      }

      const basketItem = await basketService.addDeviceToBasket(userId, deviceId, quantity)

      return ok(res, basketItem)
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }

  async removeDevice(req, res, next) {
    try {
      const userId = req.user.id
      const { deviceId } = req.params

      // Проверяем, что deviceId предоставлен
      if (!deviceId) {
        return next(ApiError.badRequest('deviceId is required'))
      }

      await basketService.removeDeviceFromBasket(userId, deviceId)

      return ok(res, { message: 'Device removed from basket successfully' })
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }

  async updateQuantity(req, res, next) {
    try {
      const userId = req.user.id
      const { deviceId } = req.params
      const { quantity } = req.body

      // Проверяем, что quantity предоставлен и является положительным числом
      if (quantity === undefined || quantity <= 0) {
        return next(ApiError.badRequest('quantity is required and must be greater than 0'))
      }

      const updatedItem = await basketService.updateDeviceQuantity(userId, deviceId, quantity)

      return ok(res, updatedItem)
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }

  async clearBasket(req, res, next) {
    try {
      const userId = req.user.id

      const result = await basketService.clearBasket(userId)

      return ok(res, {
        message: 'Basket cleared successfully',
        deletedItemsCount: result.deletedCount,
      })
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }
}

export default new BasketController()
