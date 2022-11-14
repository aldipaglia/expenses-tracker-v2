import { FC, PropsWithChildren } from 'react'
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  BrowserRouter,
} from 'react-router-dom'

import { AuthProvider, useAuthContext } from './AuthContext'
import { Dashboard, Login, Logout } from './pages'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()

const Private: FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn, verifiedAuth } = useAuthContext()
  const location = useLocation()

  if (!verifiedAuth) {
    return <div />
  }

  if (!isLoggedIn)
    return <Navigate to="/login" state={{ from: location }} replace />

  return <>{children}</>
}

const App: FC = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
   </QueryClientProvider>
  </AuthProvider>
)

export default App
