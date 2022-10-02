import { createContext, FC, ReactElement, useContext, useState } from 'react'
import { jwtVerify } from 'jose'
import config from './config'

type User = {
  id: number
  email: string
  scopes: string[]
}

interface AuthContextType {
  user?: User
  signin: (email: string, password: string) => Promise<void>
  signout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export const AuthProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [user, setUser] = useState<User>()

  const signin = async (email: string, password: string) => {
    const r = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!r.ok) {
      const err = await r.json()
      throw err
    }

    const jsonResponse = await r.json()

    const accessToken = jsonResponse.access_token
    const secretKey = new TextEncoder().encode(config.jwtSecret)

    const decoded = await jwtVerify(accessToken ?? '', secretKey)
    localStorage.setItem(config.jwtStorageKey, accessToken)

    const { iat, iss, aud, exp, sub, jti, nbf, ...rest } = decoded.payload
    setUser(rest as User)
  }

  let signout = () => {
    localStorage.removeItem(config.jwtStorageKey)
    setUser(undefined)
  }

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
