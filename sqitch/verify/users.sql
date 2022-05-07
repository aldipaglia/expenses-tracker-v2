-- Verify PROJECT_NAME_REPLACE_ME:users on pg

BEGIN;

SELECT username, password, timestamp
FROM users
WHERE FALSE;

ROLLBACK;
