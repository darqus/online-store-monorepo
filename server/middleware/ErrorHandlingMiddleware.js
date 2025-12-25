import { INTERNAL_SERVER_ERROR } from '../constants/messages.js'
import ApiError from '../error/ApiError.js'

export default (err, req, res, _next) => {
  if (err instanceof ApiError) {
    const payload = {
      success: false,
      error: {
        code: err.status,
        message: err.message,
      },
    }
    if (err.errors) {
      payload.error.details = err.errors
    }
    return res.status(err.status).json(payload)
  }
  return res.status(500).json({
    success: false,
    error: { code: 500, message: INTERNAL_SERVER_ERROR },
  })
}
