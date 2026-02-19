import ApiError from '../error/ApiError.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ok, created } from '../utils/respond.js'
import {
  USER_WITH_THIS_EMAIL_ALREADY_EXISTS,
  USER_WITH_THIS_EMAIL_NOT_FOUND,
  INVALID_PASSWORD,
  VALIDATION_ERROR,
} from '../constants/messages.js'
import { User, Basket } from '../models/models.js'
import { validationResult } from 'express-validator'

const generateJwt = (id, email, role) =>
  jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' })

// Установка httpOnly cookie с токеном
const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 часа
  })
}

class UserController {
  async registration(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest(VALIDATION_ERROR, errors.array()))
    }
    const { email, password, role } = req.body

    const candidate = await User.findOne({ where: { email } })
    if (candidate) {
      return next(ApiError.badRequest(USER_WITH_THIS_EMAIL_ALREADY_EXISTS))
    }

    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({ email, role, password: hashPassword })
    await Basket.create({ userId: user.id })
    const token = generateJwt(user.id, user.email, user.role)

    // Устанавливаем httpOnly cookie
    setAuthCookie(res, token)

    return created(res, { token })
  }

  async login(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest(VALIDATION_ERROR, errors.array()))
    }
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return next(ApiError.badRequest(USER_WITH_THIS_EMAIL_NOT_FOUND))
    }

    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
      return next(ApiError.badRequest(INVALID_PASSWORD))
    }
    const token = generateJwt(user.id, user.email, user.role)

    // Устанавливаем httpOnly cookie
    setAuthCookie(res, token)

    return ok(res, { token })
  }

  async auth(req, res) {
    // Предполагается, что middleware для проверки JWT уже отработал
    // и добавил информацию о пользователе в req.user
    const token = generateJwt(req.user.id, req.user.email, req.user.role)

    // Обновляем cookie при каждом запросе auth
    setAuthCookie(res, token)

    return ok(res, { token })
  }
}

export default new UserController()
