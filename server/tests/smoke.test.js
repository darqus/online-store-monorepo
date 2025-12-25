import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import { api, setupDb, teardownDb } from './test-utils.js'
import jwt from 'jsonwebtoken'

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  process.env.SECRET_KEY = 'testsecretkey12345'
  await setupDb()
})

afterAll(async () => {
  await teardownDb()
})

test('GET /health -> 200 ok', async () => {
  const res = await api().get('/health')
  expect(res.status).toBe(200)
  expect(res.body.ok).toBe(true)
})

test('Auth flow: register and login', async () => {
  const email = `user${Date.now()}@example.com`
  const password = 'StrongP@ssw0rd'

  const reg = await api().post('/api/user/registration').send({ email, password, role: 'USER' })
  expect(reg.status).toBe(201)
  expect(reg.body.success).toBe(true)
  expect(reg.body.data.token).toBeTruthy()

  const login = await api().post('/api/user/login').send({ email, password })
  expect(login.status).toBe(200)
  expect(login.body.success).toBe(true)
  expect(login.body.data.token).toBeTruthy()
})

test('Brand CRUD: create (admin) and list', async () => {
  const token = jwt.sign(
    { id: 1, email: 'admin@example.com', role: 'ADMIN' },
    process.env.SECRET_KEY
  )
  const name = `Brand_${Date.now()}`
  const create = await api()
    .post('/api/brand')
    .set('Authorization', `Bearer ${token}`)
    .send({ name })
  expect(create.status).toBe(201)
  expect(create.body.success).toBe(true)
  expect(create.body.data.name).toBe(name)

  const list = await api().get('/api/brand')
  expect(list.status).toBe(200)
  expect(list.body.success).toBe(true)
  expect(Array.isArray(list.body.data)).toBe(true)
})

test('Brand/Type negative: validation and unique conflict', async () => {
  const adminToken = jwt.sign(
    { id: 1, email: 'admin@example.com', role: 'ADMIN' },
    process.env.SECRET_KEY
  )

  // Validation error: short name
  const badBrand = await api()
    .post('/api/brand')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'A' })
  expect(badBrand.status).toBe(400)

  // Unique conflict: create same type twice
  const tname = `Type_${Date.now()}`
  const first = await api()
    .post('/api/type')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: tname })
  expect(first.status).toBe(201)
  const second = await api()
    .post('/api/type')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: tname })
  // May be 400 due to unique constraint from DB
  expect([400, 500]).toContain(second.status)
})

test('Device CRUD and rating', async () => {
  // Need existing brand and type (seeded or create new)
  const brandList = await api().get('/api/brand')
  const typeList = await api().get('/api/type')
  const brandId = brandList.body.data[0]?.id
  const typeId = typeList.body.data[0]?.id
  expect(brandId && typeId).toBeTruthy()

  const adminToken = jwt.sign(
    { id: 1, email: 'admin@example.com', role: 'ADMIN' },
    process.env.SECRET_KEY
  )

  // Create device with image
  const createRes = await api()
    .post('/api/device')
    .set('Authorization', `Bearer ${adminToken}`)
    .field('name', `Device_${Date.now()}`)
    .field('price', 12345)
    .field('brandId', brandId)
    .field('typeId', typeId)
    .attach('img', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), 'test.jpg')
  expect(createRes.status).toBe(201)
  expect(createRes.body.success).toBe(true)
  const deviceId = createRes.body.data.id

  // List and get by id
  const listRes = await api().get('/api/device').query({ limit: 5, page: 1 })
  expect(listRes.status).toBe(200)
  expect(listRes.body.success).toBe(true)
  const getRes = await api().get(`/api/device/${deviceId}`)
  expect(getRes.status).toBe(200)
  expect(getRes.body.success).toBe(true)

  // Rate device as USER
  const email = `rater${Date.now()}@example.com`
  const password = 'StrongP@ssw0rd'
  await api().post('/api/user/registration').send({ email, password, role: 'USER' })
  const login = await api().post('/api/user/login').send({ email, password })
  const userToken = login.body.data.token

  const rateRes = await api()
    .post('/api/device/rating')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ deviceId, rate: 5 })
  expect(rateRes.status).toBe(200)
  expect(rateRes.body.success).toBe(true)
  expect(rateRes.body.data.rating).toBeGreaterThanOrEqual(1)

  // Delete device
  const delRes = await api()
    .delete(`/api/device/${deviceId}`)
    .set('Authorization', `Bearer ${adminToken}`)
  expect(delRes.status).toBe(200)
})

test('Negative cases: validation and role checks', async () => {
  // Create device without auth
  const noAuth = await api().post('/api/device').field('name', 'X').field('price', 1)
  expect(noAuth.status).toBe(401)

  // Create device with USER token should be forbidden
  const email = `user${Date.now()}@example.com`
  const password = 'StrongP@ssw0rd'
  await api().post('/api/user/registration').send({ email, password, role: 'USER' })
  const login = await api().post('/api/user/login').send({ email, password })
  const userToken = login.body.data.token
  const forbidden = await api()
    .post('/api/device')
    .set('Authorization', `Bearer ${userToken}`)
    .field('name', 'Bad')
    .field('price', 10)
    .field('brandId', 1)
    .field('typeId', 1)
  expect([401, 403]).toContain(forbidden.status)

  // Invalid rating value
  const adminToken = jwt.sign(
    { id: 1, email: 'admin@example.com', role: 'ADMIN' },
    process.env.SECRET_KEY
  )
  const brandList = await api().get('/api/brand')
  const typeList = await api().get('/api/type')
  const deviceCreate = await api()
    .post('/api/device')
    .set('Authorization', `Bearer ${adminToken}`)
    .field('name', `DeviceBadRate_${Date.now()}`)
    .field('price', 100)
    .field('brandId', brandList.body.data[0].id)
    .field('typeId', typeList.body.data[0].id)
    .attach('img', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), 'test.jpg')
  const deviceId = deviceCreate.body.data.id

  const badRate = await api()
    .post('/api/device/rating')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ deviceId, rate: 10 })
  expect(badRate.status).toBe(400)
})
