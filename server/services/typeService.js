import { Type } from '../models/models.js'
import { getCache, setCache, delCache } from '../utils/cache.js'

export const createType = async ({ name }) => {
  const created = await Type.create({ name })
  delCache('types:list')
  return created
}
export const listTypes = async () => {
  const cacheKey = 'types:list'
  const cached = getCache(cacheKey)
  if (cached) {
    return cached
  }
  const types = await Type.findAll()
  setCache(cacheKey, types)
  return types
}

export const getTypeById = async (id) => Type.findByPk(id)
