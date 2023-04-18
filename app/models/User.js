const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:user");

class User extends Core {
    tableName = 'user';

    /**
     * An user is an object including an firstname, a lastname, an email, a password, a confirmpassword and a birthdate
     * @typedef {Object} User
     * @property {string} firstname - firstname
     * @property {string} lastname - lastname
     * @property {string} email - email
     * @property {string} password - password
     * @property {string} confirmpassword - confirmpassword
     * @property {string} birthdate - birthdate
     */

    /**
     * Get an instance of a user's information in the database by his email
     * @param {string} email instance's email
     * @returns an instance
     */
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