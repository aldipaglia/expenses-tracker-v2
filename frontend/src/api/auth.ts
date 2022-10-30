import { LoginResponse, VerifyResponse } from '../models/Auth'
import { User } from '../models/User'
import { post } from '../utils/api'

const authAPI = {
  login: (email: User['email'], password: string) =>
    post<LoginResponse>(
      '/auth/login',
      { email, password },
      { authenticated: false }
    ),
  verifyToken: (token: string) =>
    post<VerifyResponse>('/auth/verify', { access_token: token }),
}

export default authAPI
