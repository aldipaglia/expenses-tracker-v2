import Router from 'express-promise-router'

const router = Router()

router.get('/', (_, res) => res.json({ status: 'healthy' }))

export default router
