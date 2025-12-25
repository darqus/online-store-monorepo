import { Umzug, SequelizeStorage } from 'umzug'
import { db } from '../db.js'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const resolver =
  (context) =>
  ({ name, path: p }) => ({
    name,
    up: async () => {
      const href = pathToFileURL(p).href
      const mod = await import(href)
      return mod.up({ context })
    },
    down: async () => {
      const href = pathToFileURL(p).href
      const mod = await import(href)
      return mod.down({ context })
    },
  })

export const createMigrator = () =>
  new Umzug({
    migrations: {
      glob: path.join(path.dirname(fileURLToPath(import.meta.url)), '../migrations/*.js'),
      resolve: resolver(db.getQueryInterface()),
    },
    context: db.getQueryInterface(),
    storage: new SequelizeStorage({
      sequelize: db,
      modelName: 'migrations_meta',
    }),
    logger: console,
  })

export const createSeeder = () =>
  new Umzug({
    migrations: {
      glob: path.join(path.dirname(fileURLToPath(import.meta.url)), '../seeders/*.js'),
      resolve: resolver(db.getQueryInterface()),
    },
    context: db.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize: db, modelName: 'seeders_meta' }),
    logger: console,
  })
