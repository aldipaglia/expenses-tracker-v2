import { Category } from 'models/Category.js'
import { Expense } from 'models/Expenses.js'
import { IncompleteExpense } from 'models/IncompleteExpenses.js'
import { RecurringExpense } from 'models/RecurringExpenses.js'
import { User } from 'models/User.js'
import { sql } from 'slonik'
import pool from '../db.js'

type ExpenseData = Pick<
  Expense,
  'name' | 'date' | 'currency' | 'rate' | 'total'
> & { category_id: Category['id'] } & { user_id: User['id'] }

type IncompleteExpenseData = Pick<
  IncompleteExpense,
  'name' | 'date' | 'currency'
> & { category_id: Category['id'] } & { user_id: User['id'] }

type RecurringExpenseData = Pick<
  RecurringExpense,
  'name' | 'currency' | 'total' | 'frequency'
> & { category_id: Category['id'] } & { user_id: User['id'] }

export const fetchForRange = async (
  from: Expense['date'],
  to: Expense['date'],
  userId: User['id']
) => {
  const data = await pool.any(sql`
    SELECT 
      expenses.id,
      expenses.category_id,
      categories.name AS category_name,
      expenses.name,
      expenses.date,
      expenses.currency,
      expenses.rate,
      expenses.total
    FROM expenses
    INNER JOIN categories ON expenses.category_id = categories.id
    WHERE expenses.date BETWEEN ${from} AND ${to}
    AND expenses.user_id = ${userId}
    ORDER BY expenses.date ASC
  `)

  return data.map(({ category_id, category_name, ...expense }) => ({
    ...expense,
    category: {
      id: category_id,
      name: category_name,
    },
  }))
}

export const fetchRecurring = async (userId: User['id']) => {
  const data = await pool.any(sql`
    SELECT 
      recurring_expenses.id,
      recurring_expenses.category_id,
      categories.name AS category_name,
      recurring_expenses.name,
      recurring_expenses.frequency,
      recurring_expenses.currency,
      recurring_expenses.total
    FROM recurring_expenses
    INNER JOIN categories ON recurring_expenses.category_id = categories.id
    WHERE recurring_expenses.user_id = ${userId}
    ORDER BY recurring_expenses.frequency ASC
  `)

  return data.map(({ category_id, category_name, ...recurringExpense }) => ({
    ...recurringExpense,
    category: {
      id: category_id,
      name: category_name,
    },
  }))
}

export const fetchRecurringByFrequency = async (
  frequency: RecurringExpense['frequency'],
  userId: User['id']
) => {
  const data = await pool.any(sql`
    SELECT 
      recurring_expenses.id,
      recurring_expenses.category_id,
      categories.name AS category_name,
      recurring_expenses.name,
      recurring_expenses.frequency,
      recurring_expenses.currency,
      recurring_expenses.total
    FROM recurring_expenses
    INNER JOIN categories ON recurring_expenses.category_id = categories.id
    WHERE recurring_expenses.frequency = ${frequency}
    AND recurring_expenses.user_id = ${userId}
    ORDER BY recurring_expenses.frequency ASC
  `)

  return data.map(({ category_id, category_name, ...recurringExpense }) => ({
    ...recurringExpense,
    category: {
      id: category_id,
      name: category_name,
    },
  }))
}

export const incompleteExistsByID = async (id: IncompleteExpense['id']) => {
  const exists = await pool.exists(sql`
    SELECT 1 FROM incomplete_expenses WHERE id = ${id}
  `)

  return exists
}

export const fetchIncompleteByID = async (id: IncompleteExpense['id']) => {
  const incompleteExpense = await pool.one(sql`
    SELECT * FROM incomplete_expenses WHERE id = ${id}
  `)

  return incompleteExpense
}

export const deleteIncompleteByID = async (id: IncompleteExpense['id']) => {
  await pool.query(sql`
    DELETE FROM incomplete_expenses WHERE id = ${id}
  `)
}

export const fetchIncomplete = async (userId: User['id']) => {
  const data = await pool.any(sql`
    SELECT 
      incomplete_expenses.id,
      incomplete_expenses.category_id,
      categories.name AS category_name,
      incomplete_expenses.name,
      incomplete_expenses.date,
      incomplete_expenses.currency
    FROM incomplete_expenses
    INNER JOIN categories ON incomplete_expenses.category_id = categories.id
    WHERE incomplete_expenses.user_id = ${userId}
    ORDER BY incomplete_expenses.date ASC
  `)

  return data.map(({ category_id, category_name, ...incompleteExpense }) => ({
    ...incompleteExpense,
    category: {
      id: category_id,
      name: category_name,
    },
  }))
}

export const insertExpense = async ({
  name,
  date,
  currency,
  rate,
  total,
  category_id,
  user_id,
}: ExpenseData) => {
  const expense = await pool.one(sql`
    INSERT INTO expenses (
      name,
      date,
      currency,
      rate,
      total,
      category_id,
      user_id
    ) VALUES (
      ${name},
      ${date},
      ${currency},
      ${rate},
      ${total},
      ${category_id},
      ${user_id}
    )

    RETURNING 
      id, 
      name,
      date, 
      currency,
      rate, 
      total
  `)

  const category = await pool.one(sql`
    SELECT id, name FROM categories WHERE id = ${category_id} 
  `)

  return {
    ...expense,
    category,
  }
}

export const insertIncomplete = async ({
  name,
  date,
  currency,
  category_id,
  user_id,
}: IncompleteExpenseData) => {
  const incompleteExpense = await pool.one(sql`
    INSERT INTO incomplete_expenses (
      name,
      date,
      currency,
      category_id,
      user_id
    ) VALUES (
      ${name},
      ${date},
      ${currency},
      ${category_id},
      ${user_id}
    )

    RETURNING 
      id, 
      name,
      date, 
      currency
  `)

  const category = await pool.one(sql`
    SELECT id, name FROM categories WHERE id = ${category_id} 
  `)

  return {
    ...incompleteExpense,
    category,
  }
}

export const insertRecurringExpense = async ({
  frequency,
  category_id,
  currency,
  total,
  name,
  user_id,
}: RecurringExpenseData) => {
  const expense = await pool.one(sql`
    INSERT INTO recurring_expenses (
      name,
      currency,
      frequency,
      total,
      category_id,
      user_id
    ) VALUES (
      ${name},
      ${currency},
      ${frequency},
      ${total || 'NULL'},
      ${category_id}
      ${user_id}
    )

    RETURNING 
      id, 
      name, 
      currency,
      frequency, 
      total
  `)

  const category = await pool.one(sql`
    SELECT id, name FROM categories WHERE id = ${category_id} 
  `)

  return {
    ...expense,
    category,
  }
}
