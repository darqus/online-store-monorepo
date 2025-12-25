import { Basket, BasketDevice, Device, User } from '../models/models.js'
import ApiError from '../error/ApiError.js'

class BasketService {
  async getBasket(userId) {
    const basket = await Basket.findOne({
      where: { userId },
      include: [
        {
          model: BasketDevice,
          as: 'basket_devices', // Это имя ассоциации может отличаться, в зависимости от Sequelize
          include: [Device],
        },
      ],
    })

    if (!basket) {
      // Если корзина не существует, создаем новую
      const newBasket = await Basket.create({ userId })
      return {
        id: newBasket.id,
        userId: newBasket.userId,
        devices: [],
      }
    }

    // Возвращаем корзину с товарами
    return {
      id: basket.id,
      userId: basket.userId,
      devices: basket.basket_devices.map((item) => ({
        id: item.id,
        deviceId: item.deviceId,
        basketId: item.basketId,
        quantity: item.quantity,
        device: item.device,
      })),
    }
  }

  async addDeviceToBasket(userId, deviceId, quantity = 1) {
    // Проверяем, существует ли устройство
    const device = await Device.findByPk(deviceId)
    if (!device) {
      throw ApiError.notFound('Device not found')
    }

    // Получаем корзину пользователя
    let basket = await Basket.findOne({ where: { userId } })
    if (!basket) {
      basket = await Basket.create({ userId })
    }

    // Проверяем, есть ли уже такое устройство в корзине
    let basketDevice = await BasketDevice.findOne({
      where: {
        basketId: basket.id,
        deviceId,
      },
    })

    if (basketDevice) {
      // Если устройство уже в корзине, увеличиваем количество
      basketDevice = await basketDevice.update({
        quantity: parseInt(basketDevice.quantity) + parseInt(quantity),
      })
    } else {
      // Если устройства нет в корзине, создаем новую запись
      basketDevice = await BasketDevice.create({
        basketId: basket.id,
        deviceId,
        quantity: parseInt(quantity),
      })
    }

    // Возвращаем обновленный элемент корзины
    return await BasketDevice.findOne({
      where: { id: basketDevice.id },
      include: [Device],
    })
  }

  async removeDeviceFromBasket(userId, deviceId) {
    // Получаем корзину пользователя
    const basket = await Basket.findOne({ where: { userId } })
    if (!basket) {
      throw ApiError.notFound('Basket not found')
    }

    // Находим и удаляем устройство из корзины
    const basketDevice = await BasketDevice.findOne({
      where: {
        basketId: basket.id,
        deviceId,
      },
    })

    if (!basketDevice) {
      throw ApiError.notFound('Device not found in basket')
    }

    await basketDevice.destroy()
  }

  async updateDeviceQuantity(userId, deviceId, quantity) {
    // Получаем корзину пользователя
    const basket = await Basket.findOne({ where: { userId } })
    if (!basket) {
      throw ApiError.notFound('Basket not found')
    }

    // Находим устройство в корзине
    const basketDevice = await BasketDevice.findOne({
      where: {
        basketId: basket.id,
        deviceId,
      },
      include: [Device],
    })

    if (!basketDevice) {
      throw ApiError.notFound('Device not found in basket')
    }

    // Обновляем количество
    const updatedBasketDevice = await basketDevice.update({
      quantity: parseInt(quantity),
    })

    return updatedBasketDevice
  }

  async clearBasket(userId) {
    // Получаем корзину пользователя
    const basket = await Basket.findOne({ where: { userId } })
    if (!basket) {
      throw ApiError.notFound('Basket not found')
    }

    // Удаляем все товары из корзины
    const deletedCount = await BasketDevice.destroy({
      where: {
        basketId: basket.id,
      },
    })

    return { deletedCount }
  }
}

export default new BasketService()
