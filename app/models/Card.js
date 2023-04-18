const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:card");

class Card extends Core {
    tableName = 'card';

    /**
     * A card is an object including an image, a title, a description, an environmental_rating, an economic_rating, a value and an user_id
     * @typedef {Object} Card
     * @property {string} image - image
     * @property {string} title - title
     * @property {string} description - description
     * @property {integer} environmental_rating - environmental_rating
     * @property {integer} economic_rating - economic_rating
     * @property {integer} value - value
     * @property {integer} user_id - user_id
     */

    /**
     * Get an instance of all the cards belonging to a user in the database by their id
     * @param {integer} id instance's id
     * @returns an instance
     */
    async findByUser(id) {
        const preparedQuery = {
            text : `
            SELECT 
            c.id, 
            c.image, 
            c.title, 
            c.description, 
            c.environmental_rating, 
            c.economic_rating, 
            c.value, 
            CONCAT(u.firstname, ' ',u.lastname) AS "author",
            ARRAY_AGG (
                json_build_object('name', t.name, 'color', t.color)
                ORDER BY
                    t.name ASC
            ) tag
            FROM card c
            JOIN user_card uc ON uc.card_id = c.id
            JOIN tag_card tc ON tc.card_id = c.id
            JOIN tag t ON t.id = tc.tag_id
            JOIN "user" u ON u.id = c.user_id
            WHERE uc.user_id = $1
            GROUP BY c.id, c.image, c.title, c.description, c.environmental_rating, c.economic_rating, c.value, u.firstname, u.lastname;`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows;
    };

    async findByTitle(id) {
        const preparedQuery = {
            text : `SELECT * FROM card
            WHERE title = $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };

    /**
     * Get an instance of a random card, not owned by the user, in the database by their ID
     * @param {integer} id instance's id
     * @returns an instance
     */
    async getOneRandomCard(id) {
        const preparedQuery = {
            text : `SELECT 
            c.id, 
            c.image, 
            c.title, 
            c.description, 
            c.environmental_rating, 
            c.economic_rating, 
            c.value, 
            CONCAT(u.firstname, ' ',u.lastname) AS "author",
            ARRAY_AGG (
                json_build_object('tag', t.name, 'color', t.color)
                ORDER BY
                    t.name ASC
            ) tag
            FROM card c
            JOIN tag_card tc ON tc.card_id = c.id
            JOIN tag t ON t.id = tc.tag_id
            JOIN "user" u ON u.id = c.user_id
            WHERE c.id NOT IN 
                    (
                        SELECT c.id FROM card c
                        JOIN user_card uc ON uc.card_id = c.id
                        WHERE uc.user_id = $1
                    )
            GROUP BY c.id, c.image, c.title, c.description, c.environmental_rating, c.economic_rating, c.value, u.firstname, u.lastname
            ORDER BY RANDOM() 
            LIMIT 1;`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    }
};

module.exports = new Card(client);