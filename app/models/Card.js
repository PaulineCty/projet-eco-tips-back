const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:card");

/**
 * A Card is an object including an image, a title, a description, an environmental_rating, an economic_rating, a value and a user_id
 * @typedef {Object} Card
 * @property {string} image - image
 * @property {string} title - title
 * @property {string} description - description
 * @property {number} environmental_rating - environmental_rating
 * @property {number} economic_rating - economic_rating
 * @property {number} value - value
 * @property {number} user_id - user_id
 */
class Card extends Core {
    tableName = 'card';

    /**
     * Gets all Card instances belonging to a user's collection
     * @param {number} id user's id
     * @returns {Card[]} an array of Card instances
     */
    async findUserCollection(id) {
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
            ) FILTER (WHERE t.name IS NOT NULL) tags,
            uc.state,
            uc.expiration_date 
            FROM card c
            JOIN user_card uc ON uc.card_id = c.id
            LEFT JOIN tag_card tc ON tc.card_id = c.id
            LEFT JOIN tag t ON t.id = tc.tag_id
            JOIN "user" u ON u.id = c.user_id
            WHERE uc.user_id = $1
            GROUP BY c.id, c.image, c.title, c.description, c.environmental_rating, c.economic_rating, c.value, u.firstname, u.lastname, uc.state, uc.expiration_date;`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows;
    };

    /**
     * Gets a Card instance corresponding to a given title
     * @param {string} title card's title
     * @returns {Card} a Card instance
     */
    async findByTitle(title) {
        const preparedQuery = {
            text : `SELECT * FROM card
            WHERE title = $1`,
            values: [title]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };

    /**
     * Gets a random Card instance not already owned by a given user
     * @param {number} id user's id
     * @returns {Card} a Card instance
     */
    async findOneRandomCard(id) {
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
                json_build_object('name', t.name, 'color', t.color)
                ORDER BY
                    t.name ASC
            ) FILTER (WHERE t.name IS NOT NULL) tags
            FROM card c
            LEFT JOIN tag_card tc ON tc.card_id = c.id
            LEFT JOIN tag t ON t.id = tc.tag_id
            JOIN "user" u ON u.id = c.user_id
            WHERE c.id NOT IN 
                    (
                        SELECT c.id FROM card c
                        JOIN user_card uc ON uc.card_id = c.id
                        WHERE uc.user_id = $1
                    )
            AND c.proposal = false
            GROUP BY c.id, c.image, c.title, c.description, c.environmental_rating, c.economic_rating, c.value, u.firstname, u.lastname
            ORDER BY RANDOM() 
            LIMIT 1;`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };

    /**
     * Gets all Card instances that are not approved yet
     * @returns {Card[]} an array of Card instances
     */
    async findAllProposals() {
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
            ) FILTER (WHERE t.name IS NOT NULL) tags
            FROM card c
            LEFT JOIN tag_card tc ON tc.card_id = c.id
            LEFT JOIN tag t ON t.id = tc.tag_id
            JOIN "user" u ON u.id = c.user_id
            WHERE c.proposal = true
            GROUP BY c.id, c.image, c.title, c.description, c.environmental_rating, c.economic_rating, c.value, u.firstname, u.lastname;`,
        }
        const result = await this.client.query(preparedQuery);
        return result.rows;
    };

    /**
     * Sets a given Card instance to an approved state
     * @param {number} id card's id
     * @returns {integer} number of updated rows
     */
    async setProposalCardToFalse(id) {
      const preparedQuery = {
          text : `
          UPDATE card
          SET proposal = false
          WHERE id = $1`,
          values : [id]
      }
      const result = await this.client.query(preparedQuery);
      return result.rowCount;
    };

    /**
     * Gets all Card instances created by a given user
     * @param {number} id user's id
     * @returns {Card[]} an array of Card instances
     */
    async findByUser(id) {
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
                json_build_object('name', t.name, 'color', t.color)
                ORDER BY
                    t.name ASC
            ) FILTER (WHERE t.name IS NOT NULL) tags
            FROM card c
            LEFT JOIN tag_card tc ON tc.card_id = c.id
            LEFT JOIN tag t ON t.id = tc.tag_id
            JOIN "user" u ON u.id = c.user_id
            WHERE user_id = $1
            GROUP BY c.id, c.image, c.title, c.description, c.environmental_rating, c.economic_rating, c.value, u.firstname, u.lastname;
            `,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows;
    };
    
    /**
     * Gets all approved Card instances 
     * @returns {Card[]} an array of Card instances
     */
    async findAllNotProposals() {
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
            ) FILTER (WHERE t.name IS NOT NULL) tags
            FROM card c
            LEFT JOIN tag_card tc ON tc.card_id = c.id
            LEFT JOIN tag t ON t.id = tc.tag_id
            JOIN "user" u ON u.id = c.user_id
            WHERE c.proposal = false
            GROUP BY c.id, c.image, c.title, c.description, c.environmental_rating, c.economic_rating, c.value, u.firstname, u.lastname;`,
        }
        const result = await this.client.query(preparedQuery);
        return result.rows;
    };

    /**
     * Gets a specific Card instance with its tags
     * @param {number} id card's id
     * @returns {Card} a Card instance
     */
    async findByPkWithTags(id) {
        const preparedQuery = {
            text : `SELECT 
            c.id, 
            c.image,
            c.title, 
            c.description, 
            c.environmental_rating, 
            c.economic_rating, 
            c.value,
            ARRAY_AGG (
                tc.tag_id
            ) FILTER (WHERE tc.tag_id IS NOT NULL) tags
            FROM card c
            LEFT JOIN tag_card tc ON tc.card_id = c.id
            JOIN "user" u ON u.id = c.user_id
            WHERE c.id = $1
            GROUP BY c.id, c.image, c.title, c.description, c.environmental_rating, c.economic_rating, c.value, u.firstname, u.lastname;`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };
};

module.exports = new Card(client);