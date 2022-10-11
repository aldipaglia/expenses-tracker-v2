import { newDb } from 'pg-mem'
import { MigrationManager } from 'east'
import realDB from '../src/db'

jest.mock('../src/db', () => jest.fn())

export const setup = () => {
  const fakeDB = newDb().adapters.createSlonik()

  beforeAll(() => {
    ;(realDB as unknown as jest.Mock).mockImplementation(fakeDB)
  })
}

export const migrateDB = async () => {
  const migrationManager = new MigrationManager()
  await migrationManager.configure({})

  try {
    await migrationManager.connect()
    await migrationManager.migrate({ status: 'all' })
  } finally {
    await migrationManager.disconnect()
  }
}
