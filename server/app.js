import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import fileUpload from 'express-fileupload'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import fs from 'fs'
import router from './routes/index.js'
import errorHandler from './middleware/ErrorHandlingMiddleware.js'
import { STATIC_DIR, STATIC_IMAGES_PATH } from './constants/paths.js'
import { config } from './config/index.js'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger.js'

export function createApp() {
  const app = express()

  // Security & common middleware
  app.use(helmet())
  if (config.nodeEnv !== 'test') {
    app.use(morgan('dev'))
  }
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowed = config.cors.origins
        if (!origin || allowed.includes('*') || allowed.includes(origin)) {
          return callback(null, true)
        }
        return callback(new Error('CORS not allowed'), false)
      },
      credentials: true,
    })
  )
  app.use(express.json({ limit: config.limits.json }))
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        console.log(`Rate limit exceeded for ${req.method} ${req.originalUrl} from ${req.ip}`)
        res.status(429).json({ success: false, error: { code: 429, message: 'Too many requests' } })
      },
    })
  )

  // Static and file uploads
  fs.mkdirSync(STATIC_IMAGES_PATH, { recursive: true })
  app.use('/static', express.static(STATIC_DIR))
  app.use(
    fileUpload({
      limits: { fileSize: config.limits.fileSize },
      useTempFiles: false,
      abortOnLimit: true,
      parseNested: true,
    })
  )

  // Health and docs
  app.get('/health', (req, res) => res.json({ ok: true }))
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // API routes
  app.use('/api', router)

  // Error handler must be last
  app.use(errorHandler)

  return app
}

const app = createApp()
export default app
