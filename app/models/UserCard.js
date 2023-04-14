const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:usercard");

class UserCard extends Core {
    tableName = 'user_card';

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