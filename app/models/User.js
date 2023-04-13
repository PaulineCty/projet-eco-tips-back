const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:user");

class User extends Core {
    tableName = 'user';

    async findByEmail(email) {
        const preparedQuery = {
            text : `SELECT * FROM "user" WHERE email = $1`,
            values: [email]
        }
        const result = await this.client.query(preparedQuery);

        return result.rows[0];
    }
};

module.exports = new User(client);