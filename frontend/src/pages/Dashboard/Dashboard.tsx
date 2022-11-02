import { FC } from 'react'
import { Card, PageLayout, Table } from '../../components'
import './Dashboard.css'

const data = [
  {
    name: 'a',
    frequency: 'daily',
    category: { id: 1, name: 'category A' },
    total: 4400,
    currency: 'UYU',
    rate: 42.31,
  },

  {
    name: 'b',
    frequency: 'monthly',
    category: { id: 1, name: 'category B' },
    total: 12,
    currency: 'USD',
    rate: 1,
  },
]

const Dashboard: FC = () => {
  return (
    <PageLayout>
      <div className="dashboard">
        <div className="cards-container">
          <Card title="Total Views" value="308.402" delta={20} />
          <Card title="Total Views" value="308.402" delta={-20} />
          <Card title="Total Views" value="308.402" delta={0} />
          <Card title="Total Views" value="308.402" delta={50} negative />
        </div>
        <div className="table-container">
          <Table
            data={data}
            defs={[
              {
                title: 'Name',
                accessor: 'name',
              },
              {
                title: 'Frequency',
                accessor: 'frequency',
              },
              {
                title: 'Category',
                accessor: (r) => r.category.name,
              },
              {
                title: 'Total',
                accessor: (r) =>
                  r.currency === 'USD'
                    ? `$${r.total}`
                    : `$${(r.total / r.rate).toFixed(2)} (${r.currency})`,
              },
            ]}
          />
        </div>
      </div>
    </PageLayout>
  )
}

export default Dashboard
