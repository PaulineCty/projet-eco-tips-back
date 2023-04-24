const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:tag");

/**
 * A Tag is an object including a name and a color
 * @typedef {Object} Tag
 * @property {string} image - name
 * @property {string} title - color
 */
class Tag extends Core {
    tableName = 'tag';

    /**
     * Gets the Tag instance corresponding to a given name
     * @param {integer} id tag's name
     * @returns {Tag} a Tag instance
     */
    async findByName(name) {
        const preparedQuery = {
            text : `SELECT * FROM tag
            WHERE name = $1`,
            values: [name]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };

    /**
     * Gets the Tag instance corresponding to a given color
     * @param {integer} id tag's color
     * @returns {Tag} a Tag instance
     */
    async findByColor(color) {
        const preparedQuery = {
            text : `SELECT * FROM tag
            WHERE color = $1`,
            values: [color]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };
};

module.exports = new Tag(client);