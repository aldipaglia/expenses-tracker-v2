import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../AuthContext'
import './Login.css'

const Login: FC = () => {
  const navigate = useNavigate()
  const { isLoggedIn, signin } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [passwordVisible, setPasswordVisible] = useState(false)

  const [serverError, setServerError] = useState('')

  useEffect(() => {
    const goToDashboardIfLoggedIn = async () => {
      if (isLoggedIn) navigate('/', { replace: true })
    }

    goToDashboardIfLoggedIn()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await signin(email, password)
      navigate('/', { replace: true })
    } catch (err: any) {
      setServerError(err?.message as string)
    }
  }

  return (
    <div className="login">
      <img src="/favicon.svg" alt="logo" width="100" />
      <div className="panel">
        <div className="title-container">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to access your account.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            login(email, password)
          }}
        >
          <div className="input-wrapper">
            <i className="gg-mail" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="input-wrapper">
            <i className="gg-lastpass" />
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <i
              className={`view-pass-btn ${
                passwordVisible ? 'gg-eye-alt' : 'gg-eye'
              }`}
              onClick={() => setPasswordVisible((v) => !v)}
            />
          </div>
          <button type="submit" disabled={!email || !password}>
            Sign In
          </button>
        </form>
      </div>
      <div className="actions-container">
        <p className="action">
          Don't have an account? <a>Sign up now</a>
        </p>
        <p className="action">
          Forgot your password? <a>Reset Password</a>
        </p>
      </div>
    </div>
  )
}

export default Login
