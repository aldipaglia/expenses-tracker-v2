import { Category } from '../models/Category'
import { get, post, del, patch } from '../utils/api'

const categoriesAPI = {
  getCategories: () => get<Category[]>('/categories'),

  createCategory: (name: Category['name']) =>
    post<Category>('/categories', { name }),

  deleteCategory: (id: Category['id']) => del<void>(`/categories/${id}`),

  editCategory: (id: Category['id'], name: Category['name']) =>
    patch<Category>(`/categories/${id}`, { name }),
}

export default categoriesAPI
