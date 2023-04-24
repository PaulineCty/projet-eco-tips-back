const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:role");

/**
 * A Role is an object including a name
 * @typedef {Object} Role
 * @property {string} name - name
 */
class Role extends Core {
    tableName = 'role';
};

module.exports = new Role(client);