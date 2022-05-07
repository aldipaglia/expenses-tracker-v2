import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import v1Router from './v1Router'
import config from './config'

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

app.use(`${config.baseURL}/v1`, v1Router)

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
