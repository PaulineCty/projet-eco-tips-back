const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:achievement");

/**
 * @typedef {import('../models/index').Achievement} Achievement;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * An Achievement is an object including a title, an image, a description and an user_id
 * @typedef {Object} Achievement
 * @property {string} title - title
 * @property {string} image - image
 * @property {string} description - description
 * @property {number} user_id - user_id
 */
class Achievement extends Core {
    tableName = 'achievement';

    async findByTitle(title) {
        const preparedQuery = {
            text : `SELECT * FROM achievement
            WHERE title = $1`,
            values: [title]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };

    /**
     * Gets all Achievement instances that are not approved yet
     * @returns {Achievement[]} an array of Achievement instances
     */
    async findAllProposals() {
        const preparedQuery = {
            text: `SELECT 
            a.title, 
            a.image, 
            a.description, 
            CONCAT(u.firstname, ' ', u.lastname) 
            FROM achievement a
            JOIN "user" u ON u.id = a.user_id
            WHERE a.proposal = true;`
        };
        const result = await this.client.query(preparedQuery);
        return result.rows;
    }
};

module.exports = new Achievement(client);