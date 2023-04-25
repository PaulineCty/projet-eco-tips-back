const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:usercard");

/**
 * A UserCard is an object including a user_id, a card_id, an expiration_date and a state
 * @typedef {Object} UserCard
 * @property {number} user_id - user identifyer
 * @property {number} card_id - card identifyer
 * @property {date} expiration_date - card expiration date
 * @property {boolean} state - card state
 */
class UserCard extends Core {
    tableName = 'user_card';

    /**
     * Gets a specific UserCard instance corresponding to a certain user id and card id
     * @param {number} userId user's id
     * @param {number} cardId card's id
     * @returns {UserCard} a UserCard instance
     */
    async findUserCardByIds (userId, cardId) {
        const preparedQuery = {
            text : `SELECT * FROM user_card WHERE user_id = $1 AND card_id = $2`,
            values : [userId, cardId]
        }
        
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    }

    /**
     * Updates the state of a UserCard instance corresponding to a certain user id and card id
     * @param {number} userId - instance's user's id
     * @param {number} cardId - instance's card's id
     * @returns {number} number of updated rows
     */
    async updateUserCardState (userId, cardId) {
        const preparedQuery = {
            text : `
            UPDATE user_card 
            SET state = true 
            WHERE user_id = $1 AND card_id = $2 AND expiration_date < NOW()`,
            values : [userId, cardId]
        }
        
        const result = await this.client.query(preparedQuery);
        return result.rowCount;
    }

    /**
     * Deletes a specific UserCard instance corresponding to a certain user id and card id
     * @param {number} userId - instance's user's id
     * @param {number} cardId - instance's card's id
     * @returns {number} number of deleted rows
     */
    async deleteUserCard(userId, cardId) {
        const preparedQuery = {
            text : `DELETE FROM user_card
            WHERE user_id = $1 AND card_id = $2`,
            values: [userId, cardId]
        }
        const result = await this.client.query(preparedQuery);
        return result.rowCount;
    };
};

module.exports = new UserCard(client);