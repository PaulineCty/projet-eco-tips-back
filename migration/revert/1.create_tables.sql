-- Revert ecotips:1.create_tables from pg

BEGIN;

DROP INDEX email_idx;

DROP TABLE category_card, user_card, achievement, category, card, "user", role;

DROP DOMAIN posint, rating, email, color;

COMMIT;
