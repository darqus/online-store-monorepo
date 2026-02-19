import { Device, DeviceInfo, Rating, Brand } from '../models/models.js'
import ApiError from '../error/ApiError.js'
import * as path from 'path'
import {
  DEVICE_DELETED_SUCCESSFULLY,
  DEVICE_NOT_FOUND,
  INVALID_RATING,
  RATING_ALREADY_SET,
} from '../constants/messages.js'
import { STATIC_IMAGES_PATH } from '../constants/paths.js'
import crypto from 'crypto'
import { storage } from '../services/storage.js'
import { ok, created } from '../utils/respond.js'
import {
  createDevice as createDeviceTx,
  toViewDevice,
  toViewDevices,
} from '../services/deviceService.js'
import { cachedGet, cacheInvalidate } from '../utils/cache.js'

class DeviceController {
  async create(req, res, next) {
    let fileName = ''
    try {
      const { name, price, brandId, typeId } = req.body
      const rawInfo = req.body.info
      const img = req.files?.img
      let savedImage = false
      if (img) {
        // Security: validate MIME and extension
        const allowed = new Set(['image/jpeg', 'image/png', 'image/webp'])
        if (!allowed.has(img.mimetype)) {
          return next(ApiError.badRequest('Unsupported image type'))
        }
        const ext = path.extname(img.name).toLowerCase()
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          return next(ApiError.badRequest('Unsupported image extension'))
        }
        const safeBase = crypto.randomBytes(16).toString('hex')
        fileName = `${safeBase}${ext}`
        await storage.save(img, fileName, img.mimetype)
        savedImage = true
      }

      let infoArr = undefined
      if (rawInfo) {
        try {
          const parsed = typeof rawInfo === 'string' ? JSON.parse(rawInfo) : rawInfo
          if (Array.isArray(parsed)) {
            infoArr = parsed
          }
        } catch {
          return next(ApiError.badRequest('Invalid info JSON'))
        }
      }

      const device = await createDeviceTx({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
        info: infoArr,
      })
      const view = await toViewDevice(device)

      // Инвалидируем кэш устройств
      cacheInvalidate('devices:')

      return created(res, view)
    } catch (error) {
      // cleanup uploaded image on failure
      try {
        if (fileName) {
          await storage.remove(fileName)
        }
      } catch {
        void 0
      }
      next(ApiError.badRequest(error.message))
    }
  }

  async getAll(req, res) {
    const { brandId, typeId } = req.query
    let { limit, page } = req.query
    page = page || 1
    limit = limit || 9
    const offset = page * limit - limit

    const where = {}
    if (brandId) {
      where.brandId = brandId
    }
    if (typeId) {
      where.typeId = typeId
    }

    // Создаём ключ кэша на основе параметров
    const cacheKey = `devices:${typeId || 'all'}:${brandId || 'all'}:${page}:${limit}`

    const devices = await cachedGet(cacheKey, async () => {
      return await Device.findAndCountAll({
        where,
        limit: Number(limit),
        offset: Number(offset),
        include: [{ model: Brand }],
      })
    })

    const view = await toViewDevices(devices)
    return ok(res, view)
  }

  async getById(req, res) {
    const device = await Device.findOne({
      where: { id: req.params.id },
      include: [{ model: DeviceInfo, as: 'info' }],
    })
    if (!device) {
      return ok(res, null)
    }
    const view = await toViewDevice(device)
    return ok(res, view)
  }

  async setRating(req, res, next) {
    try {
      const { id } = req.user
      const { deviceId, rate } = req.body

      if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
        return next(ApiError.badRequest(INVALID_RATING))
      }

      const existingRating = await Rating.findOne({
        where: { userId: id, deviceId },
      })
      if (existingRating) {
        return next(ApiError.badRequest(RATING_ALREADY_SET))
      }

      await Rating.create({ userId: id, deviceId, rate })

      const ratings = await Rating.findAll({ where: { deviceId } })
      const averageRating = ratings.reduce((acc, item) => acc + item.rate, 0) / ratings.length

      const device = await Device.findOne({ where: { id: deviceId } })
      device.rating = Number(averageRating.toFixed(1))
      await device.save()
      const view = await toViewDevice(device)
      return ok(res, view)
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const device = await Device.findOne({ where: { id } })
      if (!device) {
        return next(ApiError.notFound(DEVICE_NOT_FOUND))
      }
      if (device.img) {
        await storage.remove(device.img)
      }
      await device.destroy()

      // Инвалидируем кэш устройств
      cacheInvalidate('devices:')

      return ok(res, { message: DEVICE_DELETED_SUCCESSFULLY })
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }
}

export default new DeviceController()
