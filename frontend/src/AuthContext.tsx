import { createContext, FC, ReactElement, useContext, useState } from 'react'
import { jwtVerify } from 'jose'
import config from './config'
import authAPI from './api/auth'

type User = {
  id: number
  email: string
  scopes: string[]
}

interface AuthContextType {
  user?: User
  signin: (email: string, password: string) => Promise<void>
  signout: () => void
  isLoggedIn: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>(null!)

export const AuthProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [user, setUser] = useState<User>()

  const signin = async (email: string, password: string) => {
    const loginResponse = await authAPI.login(email, password)

    const accessToken = loginResponse.access_token
    const secretKey = new TextEncoder().encode(config.jwtSecret)

    const decoded = await jwtVerify(accessToken ?? '', secretKey)
    localStorage.setItem(config.jwtStorageKey, accessToken)

    const { iat, iss, aud, exp, sub, jti, nbf, ...rest } = decoded.payload
    setUser(rest as User)
  }

  const signout = () => {
    localStorage.removeItem(config.jwtStorageKey)
    setUser(undefined)
  }

  const isLoggedIn = async () => {
    const token = localStorage.getItem(config.jwtStorageKey)
    const secretKey = new TextEncoder().encode(config.jwtSecret)

    try {
      await jwtVerify(token ?? '', secretKey)
      return true
    } catch (e) {
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, signin, signout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
