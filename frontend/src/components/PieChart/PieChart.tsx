import { FC, ReactNode, useId, useState } from 'react'
import { PieChart as MinimalPieChart } from 'react-minimal-pie-chart'
import ReactTooltip from 'react-tooltip'

interface Data<T> {
  value: number
  color: string
  data: T
}

interface Props<T> {
  data: Data<T>[]
  onClick?: (data: Data<T>['data']) => void
  getTooltipContent?: (data: Data<T>['data']) => ReactNode
}

function PieChart<T>({ data, onClick, getTooltipContent }: Props<T>) {
  const id = useId()

  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [hoveredIndex, setHoveredIndex] = useState<number>()

  return (
    <div data-tip="" data-for={id}>
      <MinimalPieChart
        data={data}
        lineWidth={100}
        segmentsStyle={{
          transition: 'stroke .3s',
          cursor: 'pointer',
        }}
        segmentsShift={(index) => (index === selectedIndex ? 6 : 1)}
        animate
        radius={40}
        onMouseOver={(_, index) => setHoveredIndex(index)}
        onMouseOut={() => setHoveredIndex(undefined)}
        onClick={(_, index) => {
          console.log({ index })
          setSelectedIndex(index !== selectedIndex ? index : undefined)
          onClick?.(data[index].data)
        }}
      />
      <ReactTooltip
        id={id}
        getContent={() =>
          hoveredIndex !== undefined &&
          getTooltipContent?.(data[hoveredIndex].data)
        }
      />
    </div>
  )
}

export default PieChart
