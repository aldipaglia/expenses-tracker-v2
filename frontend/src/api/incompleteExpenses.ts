import { Category } from '../models/Category'
import { Expense } from '../models/Expenses'
import { IncompleteExpense } from '../models/IncompleteExpenses'
import { get, put, del, patch } from '../utils/api'

type EditableIncompleteExpenseFields = Pick<
  IncompleteExpense,
  'name' | 'date' | 'currency'
> & { category_id: Category['id'] }

const incompleteExpensesAPI = {
  getIncompleteExpenses: () => get<IncompleteExpense[]>('/expenses/incomplete'),

  completeExpense: (id: IncompleteExpense['id'], total: Expense['total']) =>
    put<IncompleteExpense>(`/expenses/incomplete/${id}`, { total }),

  deleteIncompleteExpense: (id: IncompleteExpense['id']) =>
    del<void>(`/expenses/incomplete/${id}`),

  editIncompleteExpense: (
    id: IncompleteExpense['id'],
    fields: Partial<EditableIncompleteExpenseFields>
  ) => patch<IncompleteExpense>(`/expenses/incomplete/${id}`, fields),
}

export default incompleteExpensesAPI
