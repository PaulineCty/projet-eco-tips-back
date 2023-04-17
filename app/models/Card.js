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
        return result.rows[0];
    }

    async findByTitle(id) {
        const preparedQuery = {
            text : `SELECT * FROM card
            WHERE title = $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    }

    async getOneRandomCard(id) {
        const preparedQuery = {
            text : `SELECT * 
            FROM card 
            WHERE id NOT IN (
                SELECT c.id FROM card c
                JOIN user_card uc ON uc.card_id = c.id
                WHERE uc.user_id = $1
            )
            ORDER BY RANDOM() 
            LIMIT 1;`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    }
};

module.exports = new Card(client);