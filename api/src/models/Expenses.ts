import { Category } from './Category'

export type Currency = 'USD' | 'UYU' | 'ARS'

/**
 * Formated as yyyy-mm-dd
 * @example 2012-12-09
 */
export type DateString = string

// TODO: docstring
export interface Expense {
  id: number
  name: string
  category: Category
  date: DateString
  currency: Currency
  rate: number
  total: number
}
