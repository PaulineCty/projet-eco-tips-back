const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:tag");

class Tag extends Core {
    tableName = 'tag';

    async findByName(id) {
        const preparedQuery = {
            text : `SELECT * FROM tag
            WHERE name = $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };

    async findByColor(id) {
        const preparedQuery = {
            text : `SELECT * FROM tag
            WHERE color = $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };
};

module.exports = new Tag(client);