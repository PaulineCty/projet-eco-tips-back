const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:usercard");

class UserCard extends Core {
    tableName = 'user_card';

    async findUserCardByIds (userId, cardId) {
        const preparedQuery = {
            text : `SELECT * FROM user_card WHERE user_id = $1 AND card_id = $2`,
            values : [userId, cardId]
        }
        
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    }

    /**
     * Update an instance by setting the state of the user's card on true in the database by his id and the card id
     * @param {integer} userId - instance's user's id
     * @param {integer} cardId - instance's card's id
     * @returns an instance
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
     * Delete an instance of a user's card in the database by his id and the card id
     * @param {integer} userId - instance's user's id
     * @param {integer} cardId - instance's card's id
     * @returns an instance
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