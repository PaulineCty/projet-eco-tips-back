const { Card } = require("../models/index");
const debug = require('debug')("controller:card");

const cardController = {
    async getByUser (req, res) {
        const cards = await Card.findByUser(req.params.id);
        // const cards = await Card.findAll();
        debug(cards);
        res.json(cards);
    },

    async addCard (req, res) {
        console.log(req.body);
        const cards = await Card.create(req.body);

        debug(cards);
        res.json(cards);
    }
};

module.exports = cardController;