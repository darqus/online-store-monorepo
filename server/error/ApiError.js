class ApiError extends Error {
  constructor(status, message, errors = undefined) {
    super(message)
    this.status = status
    this.message = message
    if (errors) {
      this.errors = errors
    }
  }
  static badRequest(message, errors) {
    return new ApiError(400, message, errors)
  }
  static internal(message, errors) {
    return new ApiError(500, message, errors)
  }
  static forbidden(message, errors) {
    return new ApiError(403, message, errors)
  }
  static notFound(message, errors) {
    return new ApiError(404, message, errors)
  }
}

export default ApiError
