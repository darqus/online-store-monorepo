import { API_ENDPOINTS } from '../utils/consts'
import { $authHost, $host } from './index'

export const createType = async (type) => {
  const { data } = await $authHost.post(API_ENDPOINTS.TYPE, type)
  return data
}

export const fetchTypes = async () => {
  const { data } = await $host.get(API_ENDPOINTS.TYPE)

  // Сервер может возвращать {success: true, data: [...]}
  if (data.success && Array.isArray(data.data)) {
    return data.data
  }

  return data.data || data || []
}

export const createBrand = async (brand) => {
  const { data } = await $authHost.post(API_ENDPOINTS.BRAND, brand)
  return data
}

export const fetchBrands = async () => {
  const { data } = await $host.get(API_ENDPOINTS.BRAND)

  // Сервер может возвращать {success: true, data: [...]}
  if (data.success && Array.isArray(data.data)) {
    return data.data
  }

  return data.data || data || []
}

export const createDevice = async (device) => {
  const { data } = await $authHost.post(API_ENDPOINTS.DEVICE, device)
  return data
}

export const fetchDevices = async (typeId, brandId, page = 1, limit = 5) => {
  const { data } = await $host.get(API_ENDPOINTS.DEVICE, {
    params: {
      typeId,
      brandId,
      page,
      limit,
    },
  })

  // Сервер возвращает {success: true, data: {count, rows}}
  if (data.success && data.data) {
    return data.data
  }

  return data.data || data || {}
}

export const fetchOneDevice = async (id) => {
  const { data } = await $host.get(`${API_ENDPOINTS.DEVICE}/${id}`)
  return data.data
}
