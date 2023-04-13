const { Card } = require("../models/index");
const debug = require('debug')("controller:card");

const cardController = {
    async getByUser (req, res) {
        const cards = await Card.findByUser(req.params.id);
        // const cards = await Card.findAll();
        debug(req.user);
    },
};

module.exports = cardController;