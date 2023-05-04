const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:achievement");

/**
 * @typedef {import('../models/index').Achievement} Achievement;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * An Achievement is an object including a title, an image, a description and a user_id
 * @typedef {Object} Achievement
 * @property {string} title - title
 * @property {string} image - image
 * @property {string} description - description
 * @property {number} user_id - user_id
 */
class Achievement extends Core {
    tableName = 'achievement';

    /**
     * Gets an Achievement instance corresponding to a given title
     * @param {string} title card's title
     * @returns {Achievement} a Card instance
     */
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
            a.id,
            a.title, 
            a.image, 
            a.description, 
            CONCAT(u.firstname, ' ', u.lastname) author
            FROM achievement a
            JOIN "user" u ON u.id = a.user_id
            WHERE a.proposal = true;`
        };
        const result = await this.client.query(preparedQuery);
        return result.rows;
    };

    /**
     * Sets a given Achievement instance to an approved state
     * @param {number} id achievement's id
     * @returns {integer} number of updated rows
     */
    async setProposalAchievementToFalse(id) {
        const preparedQuery = {
            text : `
            UPDATE achievement
            SET proposal = false
            WHERE id = $1`,
            values : [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rowCount;
    };

    /**
     * Gets all approved Achievement instances 
     * @returns {Achievement[]} an array of Achievement instances
     */
    async findAllNotProposals() {
        const preparedQuery = {
            text: `SELECT 
            a.id,
            a.title, 
            a.image, 
            a.description, 
            CONCAT(u.firstname, ' ', u.lastname) author
            FROM achievement a
            JOIN "user" u ON u.id = a.user_id
            WHERE a.proposal = false;`
        };
        const result = await this.client.query(preparedQuery);
        return result.rows;
    };

    /**
     * Gets a random Achievement instance
     * @returns {Achievement} a Achievement instance
     */
    async findOneRandomAchievement() {
        const preparedQuery = {
            text: `SELECT 
            a.id,
            a.title, 
            a.image, 
            a.description, 
            CONCAT(u.firstname, ' ', u.lastname) author
            FROM achievement a
            JOIN "user" u ON u.id = a.user_id
            WHERE a.proposal = false
            ORDER BY RANDOM()
			LIMIT 1;`
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    }
};

module.exports = new Achievement(client);