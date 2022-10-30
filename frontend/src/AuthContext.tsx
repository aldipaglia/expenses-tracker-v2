import {
  createContext,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react'

import config from './config'
import authAPI from './api/auth'
import { User } from './models/User'

interface AuthContextType {
  user?: User
  isLoggedIn: boolean
  verifiedAuth: boolean
  signin: (email: User['email'], password: string) => Promise<void>
  signout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export const AuthProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [verifiedAuth, setVerifiedAuth] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User>()

  const verifyAndRefreshToken = async () => {
    const token = localStorage.getItem(config.jwtStorageKey)

    if (!token) {
      localStorage.removeItem(config.jwtStorageKey)
      localStorage.removeItem(config.userStorageKey)

      setUser(undefined)
      setIsLoggedIn(false)

      return
    }

    const response = await authAPI.verifyToken(token)

    if (response.verified) {
      const accessToken = response.access_token
      const user = response.user

      localStorage.setItem(config.jwtStorageKey, accessToken)
      localStorage.setItem(config.userStorageKey, JSON.stringify(user))

      setUser(user)
      setIsLoggedIn(true)
    }
  }

  useEffect(() => {
    const verifyAuth = async () => {
      await verifyAndRefreshToken()
      setVerifiedAuth(true)
    }

    verifyAuth()

    const INTERVAL_TIME = 1000 * 60 * 10 // 10 min
    const interval = setInterval(() => {
      verifyAndRefreshToken()
    }, INTERVAL_TIME)

    return clearInterval(interval)
  }, [])

  const signin = async (email: string, password: string) => {
    const loginResponse = await authAPI.login(email, password)

    const accessToken = loginResponse.access_token
    const user = loginResponse.user

    localStorage.setItem(config.jwtStorageKey, accessToken)
    localStorage.setItem(config.userStorageKey, JSON.stringify(user))

    setUser(user)
    setIsLoggedIn(true)
  }

  const signout = () => {
    localStorage.removeItem(config.jwtStorageKey)
    localStorage.removeItem(config.userStorageKey)

    setUser(undefined)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, verifiedAuth, signin, signout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
