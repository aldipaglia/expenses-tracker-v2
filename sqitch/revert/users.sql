-- Revert PROJECT_NAME_REPLACE_ME:users from pg

BEGIN;

DROP TABLE users;

COMMIT;
