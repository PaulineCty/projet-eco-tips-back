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
    };

    async findAllWithRole() {
        const preparedQuery = {
            text : `SELECT 
                    u.firstname,
                    u.lastname,
                    u.email,
                    u.birthdate,
                    u.ecocoins,
                    u.score,
                    r.name AS role
                    FROM "user" u 
                    JOIN role r ON r.id = u.role_id`
        }
        const result = await this.client.query(preparedQuery);
        return result.rows;
    };

    async findByPkWithRole(id) {
        const preparedQuery = {
            text : `SELECT 
                    u.firstname,
                    u.lastname,
                    u.email,
                    u.birthdate,
                    u.ecocoins,
                    u.score,
                    u.role_id
                    FROM "user" u
                    WHERE u.id = $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };

    async setUserAsAdmin(id) {
        const preparedQuery = {
            text : `UPDATE "user" SET role_id = 1 WHERE id= $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);
        return result.rowCount;
    }
};

module.exports = new User(client);