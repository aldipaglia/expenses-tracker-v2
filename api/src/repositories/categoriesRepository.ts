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

export const existsByIdAndUserId = async (
  id: Category['id'],
  userId: User['id']
) => {
  const exists = await pool.exists(sql`
    SELECT 1 FROM categories WHERE id = ${id} AND user_id = ${userId}
  `)

  return exists
}

export const fetchCategories = async (userId: User['id']) => {
  const categories = await pool.any<Pick<Category, 'id' | 'name'>>(sql`
      SELECT id, name FROM categories WHERE user_id = ${userId}
    `)

  return categories
}

export const insertCategory = async (
  name: Category['name'],
  userId: User['id']
) => {
  const category = await pool.one<Category>(sql`
    INSERT INTO categories (name, user_id)
    VALUES (${name}, ${userId})
    RETURNING id, name, user_id
  `)

  return category
}

export const deleteCategoryByID = async (id: Category['id']) => {
  await pool.query(sql`
    DELETE FROM categories WHERE id = ${id}
  `)
}

export const editCategory = async (
  id: Category['id'],
  name: Category['name']
) => {
  const editedCategory = await pool.one<Pick<Category, 'id' | 'name'>>(sql`
    UPDATE categories SET name = ${name} WHERE id = ${id}
    RETURNING id, name
  `)
  return editedCategory
}

export const categoryIsNotEmpty = (id: Category['id']) => {
  return pool.exists(sql`
    SELECT 1 FROM expenses WHERE category_id = ${id}
    UNION 
    SELECT 1 FROM recurring_expenses WHERE category_id = ${id}
    UNION
    SELECT 1 FROM incomplete_expenses WHERE category_id = ${id}
  `)
}
