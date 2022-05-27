-- Deploy PROJECT_NAME_REPLACE_ME:users to pg

BEGIN;

CREATE TABLE users (
  id        SERIAL      PRIMARY KEY,
  email     TEXT        UNIQUE NOT NULL,
  password  TEXT        NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
