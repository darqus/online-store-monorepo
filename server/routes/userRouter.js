import { Router } from 'express'
import userController from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { body } from 'express-validator'
import {
  PASSWORD_NO_UPPERCASE,
  PASSWORD_NO_NUMBER,
  PASSWORD_NO_SPECIAL_CHAR,
} from '../constants/messages.js'

const router = Router()

/**
 * @openapi
 * /api/user/registration:
 *   post:
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessAuthToken'
 *             examples:
 *               success:
 *                 summary: Successful registration
 *                 value:
 *                   success: true
 *                   data:
 *                     token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 summary: Validation error
 *                 value:
 *                   success: false
 *                   error:
 *                     code: 400
 *                     message: Validation error
 *                     details:
 *                       - msg: PASSWORD_NO_UPPERCASE
 *                         param: password
 *                         location: body
 *               exists:
 *                 summary: Email already exists
 *                 value:
 *                   success: false
 *                   error:
 *                     code: 400
 *                     message: User with this email already exists
 * /api/user/login:
 *   post:
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessAuthToken'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *       400:
 *         description: Invalid credentials or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidPassword:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: 400
 *                     message: Invalid password
 *               userNotFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: 400
 *                     message: User with this email not found
 * /api/user/auth:
 *   get:
 *     summary: Refresh auth token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessAuthToken'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/registration',
  body('email').isEmail(),
  body('password')
    .isLength({ min: 8, max: 32 })
    .custom((value) => {
      if (!/[A-Z]/.test(value)) {
        throw new Error(PASSWORD_NO_UPPERCASE)
      }
      if (!/[0-9]/.test(value)) {
        throw new Error(PASSWORD_NO_NUMBER)
      }
      if (!/[!@#$%^&*]/.test(value)) {
        throw new Error(PASSWORD_NO_SPECIAL_CHAR)
      }
      return true
    }),
  userController.registration
)
router.post('/login', body('email').isEmail(), body('password').notEmpty(), userController.login)
router.get('/auth', authMiddleware, userController.auth)

export default router
