import { FC } from 'react'
import { useAuthContext } from '../../AuthContext'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../../components'
import './Dashboard.css'

const Dashboard: FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthContext()

  const onLogoutClick = () => navigate('/logout')

  return (
    <PageLayout>
      <div className="dashboard"></div>
    </PageLayout>
  )
}

export default Dashboard
