require('ts-node/register')

import { newDb } from 'pg-mem'

jest.mock('../src/db', () => {
  const db = newDb()

  return {
    __esModule: true,
    default: db.adapters.createSlonik(),
    db,
  }
})
