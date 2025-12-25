import { Device, DeviceInfo, Rating } from '../models/models.js'
import { db } from '../db.js'
import { storage } from './storage.js'

export const createDevice = async ({ name, price, brandId, typeId, img, info }) => {
  // Wrap device and its info creation in a single transaction.
  // Any error will automatically rollback the transaction.
  return db.transaction(async (t) => {
    const device = await Device.create({ name, price, brandId, typeId, img }, { transaction: t })
    if (Array.isArray(info) && info.length) {
      for (const i of info) {
        await DeviceInfo.create(
          { title: i.title, description: i.description, deviceId: device.id },
          { transaction: t }
        )
      }
    }
    return device
  })
}

export const listDevices = async ({ where, limit, offset }) =>
  Device.findAndCountAll({ where, limit, offset })

export const getDeviceById = async (id) =>
  Device.findOne({
    where: { id },
    include: [{ model: DeviceInfo, as: 'info' }],
  })

export const addRating = async ({ userId, deviceId, rate }) => {
  await Rating.create({ userId, deviceId, rate })
  const ratings = await Rating.findAll({ where: { deviceId } })
  const averageRating = ratings.reduce((acc, r) => acc + r.rate, 0) / ratings.length
  const device = await Device.findOne({ where: { id: deviceId } })
  device.rating = Number(averageRating.toFixed(1))
  await device.save()
  return device
}

export const deleteDevice = async (id) => {
  const device = await Device.findOne({ where: { id } })
  if (!device) {
    return null
  }
  await device.destroy()
  return device
}

export const toViewDevice = async (device) => {
  if (!device) {
    return null
  }
  const plain = device.get ? device.get({ plain: true }) : device
  const imageUrl = plain.img ? await storage.url(plain.img) : null
  return { ...plain, imageUrl, imageKey: plain.img }
}

export const toViewDevices = async ({ count, rows }) => {
  const mapped = await Promise.all(rows.map((d) => toViewDevice(d)))
  return { count, rows: mapped }
}
