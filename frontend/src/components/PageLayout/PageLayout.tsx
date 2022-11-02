import { FC, PropsWithChildren } from 'react'
import Sidebar from './Sidebar'
import './PageLayout.css'

interface Props {}

const PageLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
  return (
    <div className="page-layout">
      <aside>
        <Sidebar />
      </aside>
      <main>{children}</main>
    </div>
  )
}

export default PageLayout
