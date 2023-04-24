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

    async deleteByTagCardIds (tagIds, cardId) {
        const values = [];
        const filters = [];

        let indexPlaceholder = 1;

        tagIds.forEach(tagId => {
            filters.push(`$${indexPlaceholder}`);
            values.push(tagId);
            indexPlaceholder += 1;
        });

        values.push(cardId);

        const preparedQuery = {
            text: `DELETE FROM tag_card WHERE tag_id IN (${filters.join(',')}) AND card_id = $${indexPlaceholder};`,
            values
        };
        const result = await this.client.query(preparedQuery);

        return result.rows;
    };

    async createByTagCardIds (tagIds, cardId) {
        const values = [];
        const filters = [];

        let indexPlaceholder = 1;

        tagIds.forEach(tagId => {
            filters.push(`($${indexPlaceholder},$${indexPlaceholder + 1})`);
            values.push(tagId, cardId);
            indexPlaceholder += 2;
        });

        const preparedQuery = {
            text: `INSERT INTO tag_card(tag_id, card_id) VALUES ${filters.join(',')};`,
            values
        };
        const result = await this.client.query(preparedQuery);

        return result.rows;
    };
};

module.exports = new TagCard(client);