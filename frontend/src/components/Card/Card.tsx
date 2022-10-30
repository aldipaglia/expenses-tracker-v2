import { FC } from 'react'
import { Icon } from '../../types'
import './Card.css'

interface Props {
  title: string
  value: string
  mainIcon: Icon
  secondaryIcon: Icon
}

const Card: FC<Props> = ({ title, value, mainIcon, secondaryIcon }) => {
  return (
    <div className="card">
      <div className="icons-container">
        <div className="main-icon-wrapper">
          <i className={`icon gg-${mainIcon}`} />
        </div>
        <div className="secondary-icon-wrapper">
          <i className={`icon gg-${secondaryIcon}`} />
        </div>
      </div>
      <h3 className="title">{title}</h3>
      <span className="value">{value}</span>
      <div className="action-container">
        <span className="action">Action</span>
      </div>
    </div>
  )
}

export default Card
