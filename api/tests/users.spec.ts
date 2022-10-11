import request from 'supertest'
import app from '../src/app'
import { setup } from './setup'

describe('example routes', () => {
  setup()

  describe('[GET] /example/public-resource', () => {
    it('returns a public resource', async () => {
      const response = await request(app).get('/example/public-resource')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.public).toBe('resource')
    })
  })
})
