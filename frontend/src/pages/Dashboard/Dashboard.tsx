import { FC } from 'react'
import { Card, PageLayout, Table } from '../../components'
import './Dashboard.css'

const data = [
  {
    id: 405,
    name: 'Alquiler',
    date: '2022-11-01',
    currency: 'USD',
    rate: 1,
    total: 1100,
    category: {
      id: 1,
      name: 'Alquiler',
    },
  },
  {
    id: 404,
    name: 'Google One (storage)',
    date: '2022-11-01',
    currency: 'USD',
    rate: 1,
    total: 20,
    category: {
      id: 3,
      name: 'Misc',
    },
  },
  {
    id: 406,
    name: 'Netflix',
    date: '2022-11-01',
    currency: 'USD',
    rate: 1,
    total: 8.55,
    category: {
      id: 3,
      name: 'Misc',
    },
  },
  {
    id: 408,
    name: 'Spotify',
    date: '2022-11-01',
    currency: 'USD',
    rate: 1,
    total: 8,
    category: {
      id: 3,
      name: 'Misc',
    },
  },
  {
    id: 403,
    name: 'Antel Movil',
    date: '2022-11-01',
    currency: 'UYU',
    rate: 40.80817575392832,
    total: 940,
    category: {
      id: 4,
      name: 'Gastos',
    },
  },
  {
    id: 407,
    name: 'Antel Fijo + Internet',
    date: '2022-11-01',
    currency: 'UYU',
    rate: 40.80817575392832,
    total: 1554,
    category: {
      id: 4,
      name: 'Gastos',
    },
  },
  {
    id: 409,
    name: 'UTE',
    date: '2022-11-01',
    currency: 'UYU',
    rate: 40.577085506527176,
    total: 6448,
    category: {
      id: 4,
      name: 'Gastos',
    },
  },
  {
    id: 410,
    name: 'Gas',
    date: '2022-11-01',
    currency: 'UYU',
    rate: 40.577085506527176,
    total: 1557,
    category: {
      id: 4,
      name: 'Gastos',
    },
  },
  {
    id: 411,
    name: 'Blue Cross',
    date: '2022-11-01',
    currency: 'USD',
    rate: 1,
    total: 217.66,
    category: {
      id: 4,
      name: 'Gastos',
    },
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
                title: 'Category',
                accessor: (r) => r.category.name,
                sortValue: (r) => r.category.name,
              },
              {
                title: 'Date',
                accessor: 'date',
              },
              {
                title: 'Name',
                accessor: 'name',
              },
              {
                title: 'Total',
                accessor: (r) => (
                  <div className="table-total">
                    <span className="original">
                      ${r.total} {r.currency !== 'USD' && `(${r.currency})`}
                    </span>
                    {r.currency !== 'USD' && (
                      <span className="conversion">{`[$${(
                        r.total / r.rate
                      ).toFixed(2)} USD]`}</span>
                    )}
                  </div>
                ),
                sortValue: (r) =>
                  r.currency === 'USD' ? r.total : r.total / r.rate,
              },
            ]}
          />
        </div>
      </div>
    </PageLayout>
  )
}

export default Dashboard
