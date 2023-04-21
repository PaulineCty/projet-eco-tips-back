const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:tagcard");

class TagCard extends Core {
    tableName = 'tag_card';

    async findByCardId(id) {
        const preparedQuery = {
            text : `SELECT * FROM tag_card WHERE card_id = $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);

        return result.rows;
    };

    async deleteByTagCardIds (tagId, cardId) {
        const preparedQuery = {
            text : `SELECT * FROM tag_card WHERE tag_id = $1 AND card_id = $2`,
            values : [tagId, cardId]
        }
        
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };
};

module.exports = new TagCard(client);