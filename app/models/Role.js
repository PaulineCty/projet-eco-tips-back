const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:role");

class Role extends Core {
    tableName = 'role';
};

module.exports = new Role(client);