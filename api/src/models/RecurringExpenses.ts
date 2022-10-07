import { Expense } from './Expenses'
import { Category } from './Category'

type Frequency = 'yearly' | 'monthly' | 'weekly'

export interface RecurringExpense {
  id: number
  name: Expense['name']
  category: Category
  date: Expense['date']
  currency: Expense['currency']
  total?: Expense['total']
  frequency: Frequency
}
