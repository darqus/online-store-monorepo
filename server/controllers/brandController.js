import ApiError from '../error/ApiError.js'
import { ok, created } from '../utils/respond.js'
import { createBrand, listBrands, getBrandById } from '../services/brandService.js'

class BrandController {
  async create(req, res, next) {
    try {
      const { name, country } = req.body
      if (!name) {
        return next(ApiError.badRequest('Name is required'))
      }
      const brand = await createBrand({ name, country })
      return created(res, brand)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    const brands = await listBrands()
    return ok(res, brands)
  }

  async getById(req, res, next) {
    const brand = await getBrandById(req.params.id)
    if (!brand) {
      return next(ApiError.badRequest('Brand not found'))
    }
    return ok(res, brand)
  }
}

export default new BrandController()
