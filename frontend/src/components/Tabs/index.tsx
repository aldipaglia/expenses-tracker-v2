import { FC } from 'react'
import { Tabs as OriginalTabs, TabsProps } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import './Tabs.css'

export const Tabs: FC<TabsProps> = ({ ...props }) => (
  <OriginalTabs forceRenderTabPanel {...props} />
)

export { Tab, TabList, TabPanel } from 'react-tabs'
