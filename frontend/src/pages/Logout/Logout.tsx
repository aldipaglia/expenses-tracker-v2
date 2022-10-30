import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../AuthContext'

const Logout: FC = () => {
  const navigate = useNavigate()
  const { signout } = useAuthContext()

  useEffect(() => {
    signout()
    navigate('/login', { replace: true })
  }, [])

  return null
}

export default Logout
