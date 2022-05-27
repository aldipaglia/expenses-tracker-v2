import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { ValidateError } from 'tsoa'

import config from './config'
import { RegisterRoutes } from '../build/routes'

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('../build/swagger.json')))
})

RegisterRoutes(app)

app.use((_, res: Response) => {
  res.status(404).send({ message: 'Route Not Found' })
})

app.use((err: any, _: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err instanceof ValidateError) {
      res.status(400).json({
        message: 'Validation Failed',
        fields: err.fields,
      })
      return
    }

    if (err.status === 401) {
      res.status(401).json({
        message: 'Unauthorized',
        details: err.message,
      })
      return
    }

    res.status(500).json({
      message: 'Internal Server Error',
    })
    return
  }

  next()
})

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
