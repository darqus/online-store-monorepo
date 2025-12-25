import { Router } from 'express'
import deviceController from '../controllers/deviceController.js'
import checkRoleMiddleware from '../middleware/checkRoleMiddleware.js'
import { ROLES } from '../constants/roles.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { body, query, param } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { createDeviceDto, setRatingDto } from '../dto/schemas.js'

const router = Router()

/**
 * @openapi
 * /api/device:
 *   get:
 *     summary: List devices
 *     parameters:
 *       - in: query
 *         name: brandId
 *         schema: { type: integer }
 *       - in: query
 *         name: typeId
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Paginated devices
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessDeviceList'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     count: 1
 *                     rows:
 *                       - id: 1
 *                         name: iPhone 15
 *                         price: 99900
 *                         rating: 4.7
 *                         brandId: 1
 *                         typeId: 1
 *                         imageKey: 2e4a...abcd.jpg
 *                         imageUrl: https://cdn.example.com/2e4a...abcd.jpg
 *                         info:
 *                           - title: RAM
 *                             description: 8GB
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Create device
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, brandId, typeId]
 *             properties:
 *               name: { type: string }
 *               price: { type: integer }
 *               brandId: { type: integer }
 *               typeId: { type: integer }
 *               img: { type: string, format: binary }
 *               info:
 *                 type: string
 *                 description: JSON array of {title, description}
 *     responses:
 *       201:
 *         description: Created device
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessDevice'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 5
 *                     name: Pixel
 *                     price: 79900
 *                     rating: 0
 *                     brandId: 2
 *                     typeId: 1
 *                     imageKey: f00d...beef.jpg
 *                     imageUrl: https://cdn.example.com/f00d...beef.jpg
 *                     info: []
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * /api/device/{id}:
 *   get:
 *     summary: Get device by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Device
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessDevice'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 1
 *                     name: iPhone 15
 *                     price: 99900
 *                     rating: 4.7
 *                     brandId: 1
 *                     typeId: 1
 *                     imageKey: 2e4a...abcd.jpg
 *                     imageUrl: https://cdn.example.com/2e4a...abcd.jpg
 *                     info: []
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * /api/device/rating:
 *   post:
 *     summary: Set rating for device (1-5)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [deviceId, rate]
 *             properties:
 *               deviceId: { type: integer }
 *               rate: { type: integer, minimum: 1, maximum: 5 }
 *     responses:
 *       200:
 *         description: Updated device with rating
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessDevice'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 1
 *                     rating: 4.0
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/',
  checkRoleMiddleware(ROLES.ADMIN),
  ...createDeviceDto,
  validate,
  deviceController.create
)
router.post('/rating', authMiddleware, ...setRatingDto, validate, deviceController.setRating)
router.get(
  '/',
  query('brandId').optional().isInt({ min: 1 }),
  query('typeId').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 }),
  validate,
  deviceController.getAll
)
router.get('/:id', param('id').isInt({ min: 1 }), validate, deviceController.getById)
/**
 * @openapi
 * /api/device/{id}:
 *   delete:
 *     summary: Delete device by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Deletion success message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     message: DEVICE_DELETED_SUCCESSFULLY
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  '/:id',
  checkRoleMiddleware(ROLES.ADMIN),
  param('id').isInt({ min: 1 }),
  validate,
  deviceController.delete
)

export default router
