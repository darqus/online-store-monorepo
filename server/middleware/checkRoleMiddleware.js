import { USER_NOT_AUTHORIZED } from '../constants/messages.js'
import jwt from 'jsonwebtoken'

export default (role) => (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next()
  }

  try {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : ''
    if (!token) {
      return res.status(401).json({ message: USER_NOT_AUTHORIZED })
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    if (decoded.role !== role) {
      return res.status(403).json({ message: USER_NOT_AUTHORIZED })
    }
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: USER_NOT_AUTHORIZED })
  }
}
