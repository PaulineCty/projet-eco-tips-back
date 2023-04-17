SELECT c.id, c.image, c.title, c.description, c.environmental_rating, c.economic_rating, c.value, CONCAT(u.firstname, ' ',u.lastname) AS "author"
FROM card c
JOIN user_card uc ON uc.card_id = c.id
JOIN "user" u ON u.id = c.user_id
WHERE uc.user_id = 13



SELECT tc.card_id, t.name FROM tag_card tc
JOIN tag t ON t.id = tc.tag_id
WHERE tc.card_id IN 
(
	 SELECT c.id
	 FROM card c
	 JOIN user_card uc ON uc.card_id = c.id
	 WHERE uc.user_id = 13
)
