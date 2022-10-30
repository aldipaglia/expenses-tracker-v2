import { FC, PropsWithChildren } from 'react'
import Nav from './Nav'
import Sidebar from './Sidebar'
import './PageLayout.css'

interface Props {}

const PageLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
  return (
    <div className="page-layout">
      <nav>
        <Nav />
      </nav>
      <div className="main-container">
        <aside>
          <Sidebar />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}

export default PageLayout
