import { createPool } from 'slonik'
import { createQueryLoggingInterceptor } from 'slonik-interceptor-query-logging'
import config from './config'

if (!config.pg_conn) {
  throw new Error('The connection string for postgres was not configured')
}

const interceptors = [createQueryLoggingInterceptor()]

const pool = createPool(config.pg_conn, { interceptors })

export default pool
