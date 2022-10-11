import request from 'supertest'
import app from '../src/app'
import { loginTestUser, migrateDB, rollbackDB } from './utils'

describe('example routes', () => {
  beforeAll(async () => {
    await migrateDB()
  })

  afterAll(async () => {
    await rollbackDB()
  })

  describe('[GET] /example/public-resource', () => {
    it('returns a public resource', async () => {
      const response = await request(app).get('/example/public-resource')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.public).toBe('resource')
    })
  })

  describe('[POST] /example/public-resource', () => {
    it('returns conflict response if email is in use', async () => {
      const response = await request(app)
        .post('/example/public-resource')
        .send({ email: 'existing@email.com' })

      expect(response.status).toBe(409)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toBe('Email already in use')
    })

    it('returns created response otherwise', async () => {
      const response = await request(app)
        .post('/example/public-resource')
        .send({ email: 'non-existing@email.com' })

      expect(response.status).toBe(201)
      expect(response.headers['content-type']).toMatch(/json/)
    })
  })

  describe('[GET] /example/protected-resource', () => {
    it('returns unauthorized response if not logged in', async () => {
      const response = await request(app).get('/example/protected-resource')

      expect(response.status).toBe(401)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toBe('Unauthorized')
    })

    it('returns a protected resource if logged in', async () => {
      const token = await loginTestUser()

      const response = await request(app)
        .get('/example/protected-resource?param_name=test')
        .set({ Authorization: `Bearer ${token}` })

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.protected).toBe('resource')
    })
  })
})
