import { User, Basket } from '../models/models.js'
import bcrypt from 'bcrypt'

export const createUser = async ({ email, password, role }) => {
  const hashPassword = await bcrypt.hash(password, 10)
  const user = await User.create({ email, role, password: hashPassword })
  await Basket.create({ userId: user.id })
  return user
}

export const findUserByEmail = (email) => User.findOne({ where: { email } })
