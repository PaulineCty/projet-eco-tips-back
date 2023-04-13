const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:card");

class User extends Core {
    tableName = 'user';
};

module.exports = new User(client);