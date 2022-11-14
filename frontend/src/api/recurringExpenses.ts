import { Category } from '../models/Category'
import { RecurringExpense } from '../models/RecurringExpenses'
import { get, post, del, patch } from '../utils/api'

type CreateRecurringExpenseData = Pick<
  RecurringExpense,
  'name' | 'currency' | 'total' | 'frequency'
> & {
  category_id: Category['id']
}

const recurringExpensesAPI = {
  getRecurringExpenses: () => get<RecurringExpense[]>('/expenses/recurring'),

  createRecurringExpense: (recurringExpenseData: CreateRecurringExpenseData) =>
    post<RecurringExpense>('/expenses/recurring', recurringExpenseData),

  deleteRecurringExpense: (id: RecurringExpense['id']) =>
    del<void>(`/expenses/recurring/${id}`),

  editRecurringExpense: (
    id: RecurringExpense['id'],
    fields: Partial<CreateRecurringExpenseData>
  ) => patch<RecurringExpense>(`/expenses/recurring/${id}`, fields),
}

export default recurringExpensesAPI
