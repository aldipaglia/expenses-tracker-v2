import { FC } from 'react'
import { Card, PageLayout } from '../../components'
import './Dashboard.css'

const Dashboard: FC = () => {
  return (
    <PageLayout>
      <div className="dashboard">
        <div className="cards-container">
          <Card
            title="Total Views"
            value="308.402"
            mainIcon="eye-alt"
            secondaryIcon="chevron-double-up"
          />
          <Card
            title="Total Views"
            value="308.402"
            mainIcon="eye-alt"
            secondaryIcon="chevron-double-up"
          />
          <Card
            title="Total Views"
            value="308.402"
            mainIcon="eye-alt"
            secondaryIcon="chevron-double-up"
          />
          <Card
            title="Total Views"
            value="308.402"
            mainIcon="eye-alt"
            secondaryIcon="chevron-double-up"
          />
        </div>
      </div>
    </PageLayout>
  )
}

export default Dashboard
