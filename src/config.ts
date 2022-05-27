export default {
  port: process.env.PORT,
  pg_conn: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET || 'secret123',
}
