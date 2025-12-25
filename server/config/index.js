import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(10000),
  SECRET_KEY: z.string().min(10, 'SECRET_KEY must be at least 10 chars'),
  DATABASE_URL: z.string().url().optional(),
  DB_DIALECT: z.string().default('postgres'),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().default('online_store'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().optional(),
  DB_SSL: z.enum(['true', 'false']).optional(),
  CORS_ORIGINS: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(500),
  JSON_LIMIT: z.string().default('1mb'),
  FILE_SIZE_LIMIT: z.coerce
    .number()
    .int()
    .positive()
    .default(5 * 1024 * 1024),
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_FORCE_PATH_STYLE: z.enum(['true', 'false']).optional(),
})

// In test environment, default to in-memory sqlite and a test SECRET_KEY if not provided
if (process.env.NODE_ENV === 'test') {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'sqlite::memory:'
    process.env.DB_DIALECT = 'sqlite'
  }
  if (!process.env.SECRET_KEY) {
    process.env.SECRET_KEY = 'testsecretkey12345'
  }
}

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  console.error('Invalid environment configuration:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

const raw = parsed.data

export const config = {
  nodeEnv: raw.NODE_ENV,
  port: raw.PORT,
  secretKey: raw.SECRET_KEY,
  databaseUrl: raw.DATABASE_URL,
  db: {
    dialect: raw.DB_DIALECT,
    host: raw.DB_HOST,
    port: raw.DB_PORT,
    name: raw.DB_NAME,
    user: raw.DB_USER,
    password: raw.DB_PASSWORD,
    ssl: raw.DB_SSL === 'true',
  },
  cors: {
    origins: raw.CORS_ORIGINS?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? ['*'],
  },
  limits: {
    json: raw.JSON_LIMIT,
    fileSize: raw.FILE_SIZE_LIMIT,
  },
  rateLimit: {
    windowMs: raw.RATE_LIMIT_WINDOW_MS,
    max: raw.RATE_LIMIT_MAX,
  },
  storage: {
    driver: raw.STORAGE_DRIVER,
    s3: {
      endpoint: raw.S3_ENDPOINT,
      region: raw.S3_REGION,
      bucket: raw.S3_BUCKET,
      accessKeyId: raw.S3_ACCESS_KEY_ID,
      secretAccessKey: raw.S3_SECRET_ACCESS_KEY,
      forcePathStyle: raw.S3_FORCE_PATH_STYLE === 'true',
    },
  },
}
