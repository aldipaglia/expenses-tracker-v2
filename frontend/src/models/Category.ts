import { User } from './User'

export interface Category {
  id: number
  name: string
  userId: User['id']
}
