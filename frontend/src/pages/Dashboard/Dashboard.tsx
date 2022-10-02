import { FC } from 'react'
import { useAuthContext } from '../../AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard: FC = () => {
  const navigate = useNavigate()
  const { user, signout } = useAuthContext()

  const onLogoutClick = () => {
    signout()
    navigate('/login', { replace: true })
  }

  return (
    <div>
      Dashboard
      <div>
        <code>{JSON.stringify(user)}</code>
      </div>
      <div>
        <button onClick={onLogoutClick}>logout</button>
      </div>
    </div>
  )
}

export default Dashboard
