import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import { api, setupDb, teardownDb } from './test-utils.js'
import jwt from 'jsonwebtoken'

describe('Basket API', () => {
  let userToken
  let adminToken
  let deviceId

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    process.env.SECRET_KEY = 'testsecretkey12345'
    await setupDb()

    // Создаем тестового пользователя
    const userEmail = `basketuser${Date.now()}@example.com`
    const userPassword = 'StrongP@ssw0rd'
    await api().post('/api/user/registration').send({
      email: userEmail,
      password: userPassword,
      role: 'USER',
    })
    const userLogin = await api().post('/api/user/login').send({
      email: userEmail,
      password: userPassword,
    })
    userToken = userLogin.body.data.token

    // Создаем админа для устройства
    adminToken = jwt.sign(
      { id: 1, email: 'admin@example.com', role: 'ADMIN' },
      process.env.SECRET_KEY
    )

    // Создаем тестовое устройство
    const brandList = await api().get('/api/brand')
    const typeList = await api().get('/api/type')
    const brandId = brandList.body.data[0]?.id
    const typeId = typeList.body.data[0]?.id

    const deviceRes = await api()
      .post('/api/device')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('name', `BasketDevice_${Date.now()}`)
      .field('price', 9999)
      .field('brandId', brandId)
      .field('typeId', typeId)
      .attach('img', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), 'test.jpg')

    deviceId = deviceRes.body.data.id
  })

  afterAll(async () => {
    await teardownDb()
  })

  test('GET /basket/ - get empty basket', async () => {
    const res = await api().get('/api/basket/').set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toBeDefined()
  })

  test('POST /basket/add - add device to basket', async () => {
    const res = await api()
      .post('/api/basket/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ deviceId, quantity: 2 })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  test('GET /basket/ - get basket with items', async () => {
    const res = await api().get('/api/basket/').set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data.devices)).toBe(true)
    expect(res.body.data.devices.length).toBeGreaterThan(0)
  })

  test('PUT /basket/update/:deviceId - update quantity', async () => {
    const res = await api()
      .put(`/api/basket/update/${deviceId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 5 })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  test('DELETE /basket/remove/:deviceId - remove from basket', async () => {
    const res = await api()
      .delete(`/api/basket/remove/${deviceId}`)
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  test('POST /basket/add - add without auth should fail', async () => {
    const res = await api().post('/api/basket/add').send({ deviceId, quantity: 1 })

    expect(res.status).toBe(401)
  })

  test('POST /basket/add - invalid device ID should fail', async () => {
    const res = await api()
      .post('/api/basket/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ deviceId: 99999, quantity: 1 })

    expect([400, 404, 500]).toContain(res.status)
  })

  test('DELETE /basket/clear - clear basket', async () => {
    // Сначала добавим товар в корзину
    await api()
      .post('/api/basket/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ deviceId, quantity: 1 })

    // Проверим, что товар добавлен
    const basketBefore = await api().get('/api/basket/').set('Authorization', `Bearer ${userToken}`)
    expect(basketBefore.body.data.devices.length).toBeGreaterThan(0)

    // Очистим корзину
    const res = await api().delete('/api/basket/clear').set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.message).toBe('Basket cleared successfully')
    expect(res.body.data.deletedItemsCount).toBeDefined()

    // Проверим, что корзина пуста
    const basketAfter = await api().get('/api/basket/').set('Authorization', `Bearer ${userToken}`)
    expect(basketAfter.body.data.devices.length).toBe(0)
  })

  test('DELETE /basket/clear - clear empty basket should succeed', async () => {
    const res = await api().delete('/api/basket/clear').set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.deletedItemsCount).toBe(0)
  })
})
