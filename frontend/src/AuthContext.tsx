import {
  createContext,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react'
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

const decodeToken = async (token: string) => {
  const secretKey = new TextEncoder().encode(config.jwtSecret)
  return await jwtVerify(token ?? '', secretKey)
}

const getUserFromToken = async (token: string) => {
  const decoded = await decodeToken(token)
  const { iat, iss, aud, exp, sub, jti, nbf, ...rest } = decoded.payload
  return rest as User
}

export const AuthProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const setUserFromSavedToken = async () => {
      const accessToken = localStorage.getItem(config.jwtStorageKey)

      if (accessToken) {
        const user = await getUserFromToken(accessToken)
        setUser(user)
      }
    }

    setUserFromSavedToken()
  }, [])

  const signin = async (email: string, password: string) => {
    const loginResponse = await authAPI.login(email, password)

    const accessToken = loginResponse.access_token
    const user = await getUserFromToken(accessToken)
    setUser(user)
  }

  const signout = () => {
    localStorage.removeItem(config.jwtStorageKey)
    setUser(undefined)
  }

  const isLoggedIn = async () => {
    const token = localStorage.getItem(config.jwtStorageKey)

    if (token) {
      try {
        await decodeToken(token)
        return true
      } catch (e) {
        return false
      }
    }

    return false
  }

  return (
    <AuthContext.Provider value={{ user, signin, signout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
