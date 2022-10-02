import { FC } from 'react'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import { jwtVerify } from 'jose'
import config from './config'
import { Dashboard, Login } from './pages'
import { AuthProvider } from './AuthContext'

const authLoader = async () => {
  const token = localStorage.getItem(config.jwtStorageKey)
  const secretKey = new TextEncoder().encode(config.jwtSecret)

  try {
    await jwtVerify(token ?? '', secretKey)
  } catch (err) {
    console.error(err)
    throw redirect('/login')
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    loader: authLoader,
  },
  {
    path: 'login',
    element: <Login />,
  },
])

const App: FC = () => (
  <div className="App">
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </div>
)

export default App
