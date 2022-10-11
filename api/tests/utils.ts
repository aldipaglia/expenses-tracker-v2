import fs from 'fs'
import request from 'supertest'

import app from '../src/app'
// @ts-ignore
import { db as mockDB } from '../src/db'

export const migrateDB = async () => {
  const migrationFiles = fs
    .readdirSync(__dirname + '/../migrations')
    .filter((filename) => filename.endsWith('.up.sql'))

  for (let filename of migrationFiles) {
    await mockDB.public.none(
      fs.readFileSync(__dirname + '/../migrations/' + filename, 'utf8')
    )
  }
}

export const rollbackDB = async () => {
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

export const loginTestUser = async () => {
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({ email: 'test', password: '12345678' })

  const token = loginResponse.body.access_token
  return token
}
