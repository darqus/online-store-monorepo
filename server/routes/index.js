import { Router } from 'express'

const router = Router()

import deviceRouter from './deviceRouter.js'
import userRouter from './userRouter.js'
import brandRouter from './brandRouter.js'
import typeRouter from './typeRouter.js'
import basketRouter from './basketRouter.js'

router.use('/device', deviceRouter)
router.use('/user', userRouter)
router.use('/brand', brandRouter)
router.use('/type', typeRouter)
router.use('/basket', basketRouter)

export default router
