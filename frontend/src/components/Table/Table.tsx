import { ReactNode } from 'react'
import './Table.css'

type FunctionAccessor<T> = (row: T) => ReactNode

type StringAccessor<T> = {
  [K in keyof T]: T[K] extends ReactNode ? K : never
}[keyof T]

interface ColumnDef<T> {
  title: string
  accessor: StringAccessor<T> | FunctionAccessor<T>
}

interface TableProps<T> {
  data: T[]
  defs: ColumnDef<T>[]
}

function Table<T>({ defs, data }: TableProps<T>) {
  function isFunctionAccessor(
    accessor: ColumnDef<T>['accessor']
  ): accessor is FunctionAccessor<T> {
    return typeof accessor === 'function'
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {defs.map((def) => (
            <th>{def.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr>
            {defs.map((def) => (
              // TODO: why the fuck T[StringAccessor<T>] does not comply with ReactNode????
              // it is still typesafe from the outside
              <td>
                {isFunctionAccessor(def.accessor)
                  ? def.accessor(row)
                  : (row[def.accessor] as ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
