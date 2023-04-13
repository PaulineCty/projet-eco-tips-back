const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:usercard");

class UserCard extends Core {
    tableName = 'user_card';

    async deleteUserCard(id, cardId) {
        const preparedQuery = {
            text : `DELETE FROM user_card
            WHERE user_id = $1 AND card_id = $2`,
            values: [id, cardId]
        }
        const result = await this.client.query(preparedQuery);
        console.log(result)
        return result.rows;
    };
};

module.exports = new UserCard(client);