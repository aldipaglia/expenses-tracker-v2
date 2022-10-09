import { Category } from 'models/Category'
import { User } from 'models/User'
import { sql } from 'slonik'
import pool from '../db'

export const existsByNameAndUserId = async (
  name: Category['name'],
  userId: User['id']
) => {
  const exists = await pool.exists(sql`
    SELECT 1 FROM categories WHERE name = ${name} AND user_id = ${userId}
  `)

  return exists
}

export const existsById = async (id: Category['id']) => {
  const exists = await pool.exists(sql`
    SELECT 1 FROM categories WHERE id = ${id}
  `)

  return exists
}

export const fetchCategories = async (userId: User['id']) => {
  const categories = await pool.any(sql`
      SELECT id, name FROM categories WHERE user_id = ${userId}
    `)

  return categories
}

export const insertCategory = async (
  name: Category['name'],
  userId: User['id']
) => {
  const category = await pool.one(sql`
    INSERT INTO categories (name, user_id)
    VALUES (${name}, ${userId})
    RETURNING id, name, user_id
  `)

  return category
}
