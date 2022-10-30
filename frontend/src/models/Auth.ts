import { User } from './User'

export interface LoginResponse {
  access_token: string
  user: User
}

export type VerifyResponse =
  | { verified: false }
  | ({ verified: true } & LoginResponse)
