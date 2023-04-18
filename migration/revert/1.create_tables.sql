-- Revert ecotips:1.create_tables from pg

BEGIN;

DROP INDEX email_idx;

DROP TABLE tag_card, user_card, achievement, tag, card, "user", role;

DROP DOMAIN posint, rating, email, color;

COMMIT;
