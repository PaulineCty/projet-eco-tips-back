const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:tagcard");

class TagCard extends Core {
    tableName = 'tag_card';

    async findByCardId(id) {
        const preparedQuery = {
            text : `SELECT * FROM "tag_card" WHERE card_id = $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);

        return result.rows;
    };
};

module.exports = new TagCard(client);