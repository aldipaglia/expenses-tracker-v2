import { Request } from 'express'
import { User } from './User'

export interface JWTData {
  id: User['id']
  email: User['email']
  scopes: string[]
}

export type AuthenticatedRequest = Request & { user: JWTData }
