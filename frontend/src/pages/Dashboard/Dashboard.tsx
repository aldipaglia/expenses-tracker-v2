import { FC } from 'react'
import { useAuthContext } from '../../AuthContext'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const Dashboard: FC = () => {
  const navigate = useNavigate()
  const { user, signout } = useAuthContext()

  const onLogoutClick = () => {
    signout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="first-p">Test</p>
      <p className="second-p">Test</p>
      <p className="third-p">Test</p>
      <p className="fourth-p">Test</p>
      <code>{JSON.stringify(user)}</code>
      <div>
        <button onClick={onLogoutClick}>logout</button>
      </div>
    </div>
  )
}

export default Dashboard
