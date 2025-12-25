import { validationResult } from 'express-validator'
import ApiError from '../error/ApiError.js'
import { VALIDATION_ERROR } from '../constants/messages.js'

export const validate = (req, _res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return next(ApiError.badRequest(VALIDATION_ERROR, result.array()))
  }
  return next()
}
