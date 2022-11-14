import { Category } from './Category'

export type Currency = 'USD' | 'UYU' | 'ARS'

export interface Expense {
  id: number
  name: string
  category: Category
  date: string
  currency: Currency
  rate: number
  total: number
}
