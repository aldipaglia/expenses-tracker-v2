import { LoginResponse } from '../models/Auth'
import { post } from '../utils/api'

const authAPI = {
  login: (email: string, password: string) =>
    post<LoginResponse>(
      '/auth/login',
      { email, password },
      { authenticated: false }
    ),
}

export default authAPI
