export default {
  port: process.env.PORT,
  pg_conn: process.env.DATABASE_URL,
  jwt_secret:
    process.env.JWT_SECRET ||
    'REPLACE_ME_JWT_SECRET_REPLACE_ME_JWT_SECRET_REPLACE_ME_JWT_SECRET',
  salt_rounds: 10,
}
