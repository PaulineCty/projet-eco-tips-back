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
};

module.exports = new Achievement(client);