-- Verify ecotips:1.create_tables on pg

BEGIN;

SELECT id, name FROM role WHERE FALSE;

SELECT id, firstname, lastname, email, password, birthdate, ecocoins, score, role_id FROM "user" WHERE FALSE;

SELECT id, name, color FROM category WHERE FALSE;

SELECT id, image, title, description, environmental_rating, economic_rating, value, proposal, user_id, created_at, updated_at FROM card WHERE FALSE;

SELECT id, title, picture, description, user_id FROM achievement WHERE FALSE;

SELECT id, category_id, card_id FROM category_card WHERE FALSE;

SELECT id, user_id, card_id, expiration_date, state FROM user_card WHERE FALSE;

ROLLBACK;
