const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:user");

class User extends Core {
    tableName = 'user';
};

module.exports = new User(client);