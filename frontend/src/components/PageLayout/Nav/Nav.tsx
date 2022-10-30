import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../AuthContext'
import './Nav.css'

interface Props {}

const Nav: FC<Props> = () => {
  const navigate = useNavigate()

  const onLogoutClick = () => navigate('/logout')

  return (
    <div className="nav">
      <button onClick={onLogoutClick}>Logout</button>
    </div>
  )
}

export default Nav
