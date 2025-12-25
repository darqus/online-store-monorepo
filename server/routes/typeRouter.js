import { Router } from 'express'
import typeController from '../controllers/typeController.js'
import checkRoleMiddleware from '../middleware/checkRoleMiddleware.js'
import { ROLES } from '../constants/roles.js'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { createTypeDto } from '../dto/schemas.js'

const router = Router()

/**
 * @openapi
 * /api/type:
 *   get:
 *     summary: List types
 *     responses:
 *       200:
 *         description: List of types
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessTypeList'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       name: Smartphone
 *                       createdAt: '2025-01-01T00:00:00.000Z'
 *                       updatedAt: '2025-01-01T00:00:00.000Z'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Create type
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessType'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 10
 *                     name: Tablet
 *                     createdAt: '2025-01-01T00:00:00.000Z'
 *                     updatedAt: '2025-01-01T00:00:00.000Z'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/',
  checkRoleMiddleware(ROLES.ADMIN),
  ...createTypeDto,
  validate,
  typeController.create
)
router.get('/', typeController.getAll)

export default router
