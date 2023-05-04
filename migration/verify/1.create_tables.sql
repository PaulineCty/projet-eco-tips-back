-- Verify ecotips:1.create_tables on pg

BEGIN;

SELECT id, name, created_at, updated_at FROM role WHERE FALSE;

SELECT id, firstname, lastname, email, password, birthdate, ecocoins, score, role_id, created_at, updated_at FROM "user" WHERE FALSE;

SELECT id, name, color, created_at, updated_at FROM tag WHERE FALSE;

SELECT id, image, title, description, environmental_rating, economic_rating, value, proposal, user_id, created_at, updated_at FROM card WHERE FALSE;

SELECT id, title, image, proposal, description, user_id, created_at, updated_at FROM achievement WHERE FALSE;

SELECT id, tag_id, card_id, created_at, updated_at FROM tag_card WHERE FALSE;

SELECT id, user_id, card_id, expiration_date, state, created_at, updated_at FROM user_card WHERE FALSE;

ROLLBACK;
