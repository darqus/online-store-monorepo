import { body } from 'express-validator'

export const createBrandDto = [
  body('name').isString().trim().isLength({ min: 2, max: 64 }),
  body('country').optional().isString().trim().isLength({ min: 2, max: 64 }),
]
export const createTypeDto = [body('name').isString().trim().isLength({ min: 2, max: 64 })]
export const createDeviceDto = [
  body('name').isString().trim().isLength({ min: 2, max: 128 }),
  body('price').isInt({ min: 0 }),
  body('brandId').isInt({ min: 1 }),
  body('typeId').isInt({ min: 1 }),
]
export const setRatingDto = [
  body('deviceId').isInt({ min: 1 }),
  body('rate').isInt({ min: 1, max: 5 }),
]
