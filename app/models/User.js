const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:user");

/**
 * A User is an object including a firstname, a lastname, an email, a password, a confirmpassword, a birthdate and a role_id
 * @typedef {Object} User
 * @property {string} firstname - firstname
 * @property {string} lastname - lastname
 * @property {string} email - email
 * @property {string} password - password
 * @property {string} confirmpassword - confirmpassword
 * @property {string} birthdate - birthdate
 * @property {number} role_id - role identifyer
 */
class User extends Core {
    tableName = 'user';

    /**
     * Gets a User instance corresponding to a given email
     * @param {string} email user's email
     * @returns {User} a User instance
     */
    async findByEmail(email) {
        const preparedQuery = {
            text : `SELECT * FROM "user" WHERE email = $1`,
            values: [email]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };

    /**
     * Gets all User instances without any password related information
     * @returns {User[]} an array of User instances
     */
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

    /**
     * Gets a User instance corresponding to a given id without any password related information
     * @param {number} id user's id
     * @returns {User} a User instance
     */
    async findByPk(id) {
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

    /**
     * Sets a User instance's role_id to 1 (administrator role)
     * @param {number} id user's id
     * @returns {number} number of updated rows
     */
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