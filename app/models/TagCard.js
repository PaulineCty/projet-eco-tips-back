const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:tagcard");

/**
 * A TagCard is an object including a tag_id, and a card_id
 * @typedef {Object} TagCard
 * @property {number} tag_id - tag identifyer
 * @property {number} card_id - card identifyer
 */
class TagCard extends Core {
    tableName = 'tag_card';

    /**
     * Gets all TagCard instances associated to a card
     * @param {number} id card's id
     * @returns {TagCard[]} an array of TagCard instances
     */
    async findByCardId(id) {
        const preparedQuery = {
            text : `SELECT * FROM tag_card WHERE card_id = $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);

        return result.rows;
    };

    /**
     * Deletes all TagCard instances according to the given parameters
     * @param {number[]} tagIds an array of tag ids
     * @param {number} cardId card's id
     * @returns {number} number of deleted rows
     */
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

        return result.rowCount;
    };

    /**
     * Creates TagCard instances according to the given parameters
     * @param {number[]} tagIds an array of tag ids
     * @param {number} cardId card's id
     * @returns {number} number of created rows
     */
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

        return result.rowCount;
    };
};

module.exports = new TagCard(client);