import { FC } from 'react'
import './Card.css'

interface Props {
  title: string
  value: string
  delta: number
  negative?: boolean
}

const Card: FC<Props> = ({ title, value, delta, negative = false }) => {
  const shouldDeltaBeNeutral = delta === 0
  const shouldDeltaBeGreen = (delta > 0 && !negative) || (delta < 0 && negative)

  return (
    <div className="card">
      <div className="container">
        <h3 className="title">{title}</h3>
        <button>
          <i className="gg-more-vertical-alt" />
        </button>
      </div>
      <div className="container">
        <span className="value">{value}</span>
        <span
          className={`delta ${
            !shouldDeltaBeNeutral ? (shouldDeltaBeGreen ? 'green' : 'red') : ''
          }`}
        >
          {!shouldDeltaBeNeutral && (
            <i className={`gg-arrow-${delta > 0 ? 'up' : 'down'}`} />
          )}
          {Math.abs(delta) + '%'}
        </span>
      </div>
    </div>
  )
}

export default Card
