const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:card");

class Card extends Core {
    tableName = 'card';

    async findByUser(id) {
        const preparedQuery = {
            text : `SELECT * FROM card c
            JOIN user_card uc ON uc.card_id = c.id
            WHERE uc.user_id = $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);

        return result.rows;
    }
};

module.exports = new Card(client);