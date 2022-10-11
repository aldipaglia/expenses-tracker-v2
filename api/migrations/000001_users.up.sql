BEGIN;

CREATE TABLE users (
  id        SERIAL      PRIMARY KEY,
  email     TEXT        UNIQUE NOT NULL,
  password  TEXT        NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (id, email, password) VALUES (1, 'test', '$2b$10$f4UUOF64nTt1AYLBZjnGXeErMHcW02kQtoTj4DgqUZjInjYS.MCyW');

COMMIT;