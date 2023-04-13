const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:card");

class Tag extends Core {
    tableName = 'category';
};

module.exports = new Tag(client);