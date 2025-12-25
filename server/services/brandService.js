import { Brand } from '../models/models.js'
import { getCache, setCache, delCache } from '../utils/cache.js'

export const createBrand = async ({ name, country }) => {
  const created = await Brand.create({ name, country })
  delCache('brands:list')
  return created
}

export const listBrands = async () => {
  const cacheKey = 'brands:list'
  const cached = getCache(cacheKey)
  if (cached) {
    return cached
  }
  const brands = await Brand.findAll()
  setCache(cacheKey, brands)
  return brands
}

export const getBrandById = async (id) => {
  return Brand.findByPk(id)
}
