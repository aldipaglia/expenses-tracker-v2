-- Verify PROJECT_NAME_REPLACE_ME:users on pg

BEGIN;

SELECT email, password, timestamp
FROM users
WHERE FALSE;

ROLLBACK;
