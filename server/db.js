import { Sequelize } from 'sequelize'
import { config } from './config/index.js'

// Support either a single DATABASE_URL (e.g., postgres://user:pass@host:5432/db)
// or discrete env vars (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_DIALECT)
const useUrl = !!config.databaseUrl

const sequelize = useUrl
  ? new Sequelize(config.databaseUrl, {
      dialect: config.db.dialect,
      logging: false,
      dialectOptions: config.db.ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
    })
  : new Sequelize(config.db.name, config.db.user, config.db.password || '', {
      host: config.db.host,
      port: config.db.port,
      dialect: config.db.dialect,
      logging: false,
      dialectOptions: config.db.ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
    })

export const db = sequelize
