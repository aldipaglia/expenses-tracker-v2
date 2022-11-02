import { ReactNode, useMemo, useState } from 'react'
import './Table.css'

interface Identifiable {
  id: string | number
}

type SortOrder = 'NONE' | 'DESC' | 'ASC'

const nextSortOrder: Record<SortOrder, SortOrder> = {
  NONE: 'DESC',
  ASC: 'NONE',
  DESC: 'ASC',
}

type FunctionAccessor<T> = (row: T) => ReactNode

type StringAccessor<T> = {
  [K in keyof T]: T[K] extends ReactNode ? K : never
}[keyof T]

type Accessor<T> = StringAccessor<T> | FunctionAccessor<T>

interface ColumnDef<T> {
  title: string
  accessor: Accessor<T>
  sortValue?: (row: T) => string | number | Date
}

interface SortableColumnDefByAccessor<T> extends ColumnDef<T> {
  accessor: StringAccessor<T>
  sortValue: undefined
}

interface SortableColumnDefBySortValue<T> extends ColumnDef<T> {
  sortValue: (row: T) => string | number | Date
}

type SortableColumnDef<T> =
  | SortableColumnDefByAccessor<T>
  | SortableColumnDefBySortValue<T>

interface TableProps<T> {
  data: T[]
  defs: ColumnDef<T>[]
}

function isFunctionAccessor<T>(
  accessor: Accessor<T>
): accessor is FunctionAccessor<T> {
  return typeof accessor === 'function'
}

function isSortable<T>(def: ColumnDef<T>): def is SortableColumnDef<T> {
  return !!def.sortValue || !isFunctionAccessor(def.accessor)
}

// TODO: why the fuck T[StringAccessor<T>] does not comply with ReactNode????
// it is still typesafe from the outside
function getValue<T>(row: T, accessor: Accessor<T>) {
  return isFunctionAccessor(accessor)
    ? accessor(row)
    : (row[accessor] as ReactNode)
}

function Table<T extends Identifiable>({ defs, data }: TableProps<T>) {
  const [sortingBy, setSortingBy] = useState<SortableColumnDef<T>>()
  const [sortOrder, setSortOrder] = useState<SortOrder>('NONE')
  const toggleSortOrder = () => setSortOrder((o) => nextSortOrder[o])

  const onHeaderClick = (def: ColumnDef<T>) => {
    if (!isSortable(def)) return
    if (sortingBy !== def) {
      setSortingBy(def)
      setSortOrder('DESC')
    } else {
      toggleSortOrder()
    }
  }

  // TODO: add proper memoization (useMemo only prevents recalculation from re-renders)
  const sortedData = useMemo(() => {
    if (!sortingBy || sortOrder === 'NONE') return data

    const getValue = (row: T) =>
      !!sortingBy.sortValue ? sortingBy.sortValue(row) : row[sortingBy.accessor]

    const dataCopy = [...data]

    return dataCopy.sort((a, b) => {
      const order = getValue(b) > getValue(a) ? -1 : 1
      return sortOrder === 'ASC' ? order : order * -1
    })
  }, [data, sortingBy, sortOrder])

  return (
    <table className="table">
      <thead>
        <tr>
          {defs.map((def) => (
            <th key={def.title} onClick={() => onHeaderClick(def)}>
              <div className="title-wrapper">
                {def.title}{' '}
                {sortingBy?.title === def.title && sortOrder !== 'NONE' && (
                  <i
                    className={`gg-arrow-${
                      sortOrder === 'DESC' ? 'down' : 'up'
                    }`}
                  />
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={`row-${row.id}`}>
            {defs.map((def) => (
              <td key={`${def.title}-${row.id}`}>
                {getValue(row, def.accessor)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
