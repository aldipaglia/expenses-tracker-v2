import { useQuery, useMutation } from '@tanstack/react-query'
import expensesAPI from '../api/expenses'
import { Category } from '../models/Category'
import { Expense } from '../models/Expenses'

// type CreateExpenseData = Pick<
//   Expense,
//   'name' | 'date' | 'currency' | 'total'
// > & {
//   category_id: Category['id']
// }

export const useExpenses = (from: Expense['date'], to: Expense['date']) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => expensesAPI.getExpenses(from, to),
  })
  return { expenses: data, expensesError: error, isLoadingExpenses: isLoading }
}
