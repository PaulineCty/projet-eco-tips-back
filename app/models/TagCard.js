const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:tagcard");

class TagCard extends Core {
    tableName = 'tag_card';
};

module.exports = new TagCard(client);