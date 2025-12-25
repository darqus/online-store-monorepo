import request from 'supertest'
import { db } from '../db.js'
import app from '../app.js'
import { createMigrator, createSeeder } from '../db/migrator.js'
import { clearCache } from '../utils/cache.js'

export const setupDb = async () => {
  // Для тестов используем файловую SQLite базу данных
  if (process.env.NODE_ENV === 'test') {
    process.env.DATABASE_URL = 'sqlite:./test.db'
  }

  const migrator = createMigrator()
  await migrator.up()
  const seeder = createSeeder()
  await seeder.up()
}

export const teardownDb = async () => {
  // Очищаем кеш перед закрытием
  clearCache()
  await db.close()

  // Удаляем тестовую базу данных
  if (process.env.NODE_ENV === 'test') {
    const fs = await import('fs/promises')
    try {
      await fs.unlink('./test.db')
    } catch {
      // Игнорируем ошибку, если файл не существует
    }
  }
}

export const api = () => request(app)
