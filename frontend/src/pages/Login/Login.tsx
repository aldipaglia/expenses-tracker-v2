import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../AuthContext'

const Login: FC = () => {
  const navigate = useNavigate()
  const { isLoggedIn, signin } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [serverError, setServerError] = useState('')

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await isLoggedIn()
      if (loggedIn) navigate('/', { replace: true })
    }

    checkLoginStatus()
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
    <section className="h-100">
      <div className="container h-100">
        <div className="row justify-content-sm-center h-100">
          <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
            <div className="text-center my-5">
              <img src="/favicon.svg" alt="logo" width="100" />
            </div>

            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4">Login</h1>

                {serverError && (
                  <div className="mb-4">
                    <span className="text-danger">{serverError}</span>
                  </div>
                )}

                <div className="mb-3">
                  <label className="mb-2 text-muted" htmlFor="email">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <div className="mb-2 w-100">
                    <label className="text-muted" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => login(email, password)}
                    disabled={!email || !password}
                  >
                    Login
                  </button>
                </div>
              </div>
              <div className="card-footer py-3 border-0">
                <div className="text-center">
                  Don't have an account?{' '}
                  <a href="#" className="text-dark">
                    Create One
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center mt-5 text-muted">
              Copyright &copy; 2017-2021 &mdash; Your Company
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
