const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:usercard");

class UserCard extends Core {
    tableName = 'user_card';
};

module.exports = new UserCard(client);