import fs from 'fs'
import request from 'supertest'
import { newDb } from 'pg-mem'
import app from '../src/app'

// @ts-ignore
import { db as mockDB } from '../src/db'

jest.mock('../src/db', () => {
  const db = newDb()

  return {
    __esModule: true,
    default: db.adapters.createSlonik(),
    db,
  }
})

const migrateDB = async () => {
  const migrationFiles = fs
    .readdirSync(__dirname + '/../migrations')
    .filter((filename) => filename.endsWith('.up.sql'))

  for (let filename of migrationFiles) {
    await mockDB.public.none(
      fs.readFileSync(__dirname + '/../migrations/' + filename, 'utf8')
    )
  }
}

const rollbackDB = async () => {
  const migrationFiles = fs
    .readdirSync(__dirname + '/../migrations')
    .filter((filename) => filename.endsWith('.down.sql'))
    .reverse()

  for (let filename of migrationFiles) {
    await mockDB.public.none(
      fs.readFileSync(__dirname + '/../migrations/' + filename, 'utf8')
    )
  }
}

describe('example routes', () => {
  beforeEach(async () => {
    await migrateDB()
  })

  afterEach(async () => {
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
      // TODO: move to util
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({ email: 'test', password: '12345678' })

      const token = loginResponse.body.access_token

      const response = await request(app)
        .get('/example/protected-resource?param_name=test')
        .set({ Authorization: `Bearer ${token}` })

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.protected).toBe('resource')
    })
  })
})
