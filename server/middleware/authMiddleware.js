import { USER_NOT_AUTHORIZED } from '../constants/messages.js'
import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    // Чтение токена из cookie или заголовка Authorization
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: USER_NOT_AUTHORIZED })
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch (_error) {
    res.status(401).json({ message: USER_NOT_AUTHORIZED })
  }
}
