import { db } from './db.js'
import app from './app.js'
import { config } from './config/index.js'
import { logger } from './utils/logger.js'
import { createMigrator } from './db/migrator.js'

const port = config.port

const start = async () => {
  try {
    await db.authenticate()
    logger.info('✅ DB connection established')
    // Optional: run migrations automatically in development if AUTO_MIGRATE=true
    if (process.env.NODE_ENV !== 'production' && process.env.AUTO_MIGRATE === 'true') {
      const migrator = createMigrator()
      await migrator.up()
      logger.info('📦 Migrations applied on startup (dev)')
    }
    const server = app.listen(port, '0.0.0.0', () => {
      const addr = server.address()
      if (addr) {
        const { address, port: p } = addr
        logger.info(`🚀 Server listening on http://${address}:${p}`)
      }
    })

    // Graceful shutdown in dev
    const shutdown = async (sig) => {
      try {
        logger.info(`Received ${sig}. Shutting down...`)
        await new Promise((resolve) => server.close(resolve))
        await db.close()
        logger.info('✅ Shutdown complete')
        process.exit(0)
      } catch (e) {
        logger.error('Error during shutdown', e)
        process.exit(1)
      }
    }
    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
  } catch (error) {
    logger.error('❌ Unable to connect to the database')
    // Show a concise hint without leaking sensitive info
    logger.error(
      `Dialect=${config.db.dialect} Host=${config.db.host} Port=${config.db.port} DB=${config.db.name} User=${config.db.user}`
    )
    logger.error(error.message)
    process.exit(1)
  }
}

start()
