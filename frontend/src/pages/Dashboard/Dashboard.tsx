import { Card, PageLayout, Table } from '../../components'
import { formatMoney } from '../../utils/format'
import { useExpenses } from '../../queries/expenses'
import { Expense } from '../../models/Expenses'

const Dashboard = () => {

  const from = '2012-12-09'
  const to = '2013-12-09'
  const {expenses, expensesError, isLoadingExpenses} = useExpenses(from, to)
  if (expensesError || isLoadingExpenses) return null
  return (
    <PageLayout>
      <Card
        title="Total Expended"
        value={formatMoney(
        expenses!.reduce(
          (acc, curr) =>
            acc +
            (curr.currency === 'USD'
              ? curr.total
              : curr.total / curr.rate),
          0
        )
      )}
      delta={20}
      negative
    />
      <Table
        data={expenses!}
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
                  {formatMoney(r.total)}{' '}
                  {r.currency !== 'USD' && `(${r.currency})`}
                </span>
                {r.currency !== 'USD' && (
                  <span className="conversion">{`[${formatMoney(
                    r.total / r.rate
                  )} USD]`}</span>
                )}
              </div>
            ),
            sortValue: (r) =>
              r.currency === 'USD' ? r.total : r.total / r.rate,
          },
        ]}
      />
    </PageLayout>
  )
}

export default Dashboard
