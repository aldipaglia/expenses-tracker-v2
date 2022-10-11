BEGIN;

CREATE TABLE users (
  id        SERIAL      PRIMARY KEY,
  email     TEXT        UNIQUE NOT NULL,
  password  TEXT        NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- test - 12345678
INSERT INTO users (email, password) VALUES ('test', '$2b$10$f4UUOF64nTt1AYLBZjnGXeErMHcW02kQtoTj4DgqUZjInjYS.MCyW');

-- test2 - 12345678
INSERT INTO users (email, password) VALUES ('test2', '$2b$10$f4UUOF64nTt1AYLBZjnGXeErMHcW02kQtoTj4DgqUZjInjYS.MCyW');

COMMIT;