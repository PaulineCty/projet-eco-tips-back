const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:tag");

class Tag extends Core {
    tableName = 'tag';
};

module.exports = new Tag(client);