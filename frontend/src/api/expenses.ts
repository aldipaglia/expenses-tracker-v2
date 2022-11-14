import { Category } from '../models/Category'
import { Expense } from '../models/Expenses'
import { get, post, del, patch } from '../utils/api'

type CreateExpenseData = Pick<
  Expense,
  'name' | 'date' | 'currency' | 'total'
> & {
  category_id: Category['id']
}

const expensesAPI = {
  getExpenses: (from: Expense['date'], to: Expense['date']) =>
    get<Expense[]>('/expenses', { from, to }),

  createExpense: (expenseData: CreateExpenseData) =>
    post<Expense>('/expenses', expenseData),

  deleteExpense: (expenseId: Expense['id']) =>
    del<void>(`/expenses/${expenseId}`),

  editExpense: (
    expenseId: Expense['id'],
    editExpenseData: Partial<CreateExpenseData>
  ) => patch<Expense>(`/expenses/${expenseId}`, editExpenseData),
}

export default expensesAPI
