import { Category } from './Category'
import { Expense } from './Expenses'

export interface IncompleteExpense {
  id: number
  name: Expense['name']
  category: Category
  date: Expense['date']
  currency: Expense['currency']
}
