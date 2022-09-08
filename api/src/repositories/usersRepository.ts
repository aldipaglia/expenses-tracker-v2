import { User } from 'models/User'
import { sql } from 'slonik'
import pool from '../db'

export const fetchByEmail = async (
  email: User['email']
): Promise<User | null> => {
  return await pool.maybeOne<User>(sql`
    SELECT
      users.id,
      users.email,
      users.password
    FROM users
    WHERE users.email = ${email};
  `)
}

export const create = async (
  email: User['email'],
  password: User['password']
): Promise<User> => {
  return await pool.one<User>(sql`
    INSERT INTO users(email, password) 
    VALUES (${email}, ${password})
    RETURNING id, email, password;
  `)
}
