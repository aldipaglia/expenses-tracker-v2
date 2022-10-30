import { FC } from 'react'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import { jwtVerify } from 'jose'
import config from './config'
import { Dashboard, Login } from './pages'
import { AuthProvider } from './AuthContext'
import Logout from './pages/Logout'

const privateRouteLoader = async () => {
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
    loader: privateRouteLoader,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'logout',
    element: <Logout />,
  },
])

const App: FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)

export default App
