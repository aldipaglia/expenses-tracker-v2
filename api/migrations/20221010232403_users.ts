import { sql } from 'slonik'
import pool from '../src/db'

export async function migrate() {
  await pool.any(sql`
    CREATE TABLE users (
      id        SERIAL      PRIMARY KEY,
      email     TEXT        UNIQUE NOT NULL,
      password  TEXT        NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  // test 12345678
  await pool.any(sql`
    INSERT INTO users (id, email, password) VALUES (1, 'test', '$2b$10$f4UUOF64nTt1AYLBZjnGXeErMHcW02kQtoTj4DgqUZjInjYS.MCyW')
  `)
}

export async function rollback() {
  await pool.any(sql`DROP TABLE users`)
}
