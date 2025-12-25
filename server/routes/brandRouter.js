import { Router } from 'express'
import brandController from '../controllers/brandController.js'
import checkRoleMiddleware from '../middleware/checkRoleMiddleware.js'
import { ROLES } from '../constants/roles.js'
import { body, param } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { createBrandDto } from '../dto/schemas.js'

const router = Router()

/**
 * @openapi
 * /api/brand:
 *   get:
 *     summary: List brands
 *     responses:
 *       200:
 *         description: List of brands
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessBrandList'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       name: Apple
 *                       createdAt: '2025-01-01T00:00:00.000Z'
 *                       updatedAt: '2025-01-01T00:00:00.000Z'
 *   post:
 *     summary: Create brand
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
 *               name:
 *                 type: string
 *                 example: Apple
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessBrand'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 10
 *                     name: Apple
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
  ...createBrandDto,
  validate,
  brandController.create
)
router.get('/', brandController.getAll)
/**
 * @openapi
 * /api/brand/{id}:
 *   get:
 *     summary: Get brand by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Brand found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessBrand'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 1
 *                     name: Apple
 *                     createdAt: '2025-01-01T00:00:00.000Z'
 *                     updatedAt: '2025-01-01T00:00:00.000Z'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', param('id').isInt({ min: 1 }), validate, brandController.getById)

export default router
