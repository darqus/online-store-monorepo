import ApiError from '../error/ApiError.js'
import { ok, created } from '../utils/respond.js'
import { createType, listTypes } from '../services/typeService.js'
import { cachedGet, cacheInvalidate } from '../utils/cache.js'

class TypeController {
  async create(req, res, next) {
    try {
      const { name } = req.body
      if (!name) {
        return next(ApiError.badRequest('Name is required'))
      }
      const type = await createType({ name })

      // Инвалидируем кэш типов
      cacheInvalidate('types:')

      return created(res, type)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    const types = await cachedGet('types:all', async () => {
      return await listTypes()
    })
    return ok(res, types)
  }
}

export default new TypeController()
