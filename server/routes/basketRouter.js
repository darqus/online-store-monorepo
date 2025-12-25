import Router from 'express'
import basketController from '../controllers/basketController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

// Получение содержимого корзины пользователя
router.get('/', authMiddleware, basketController.getBasket)

// Добавление товара в корзину
router.post('/add', authMiddleware, basketController.addDevice)

// Удаление товара из корзины по ID
router.delete('/remove/:deviceId', authMiddleware, basketController.removeDevice)

// Обновление количества товара в корзине
router.put('/update/:deviceId', authMiddleware, basketController.updateQuantity)

// Очистка корзины
router.delete('/clear', authMiddleware, basketController.clearBasket)

export default router
