const { UserCard } = require("../models/index");
const debug = require('debug')("controller:usercard");

const userCardController = {
    async updateUserCardState (req, res) {
        const id = req.params.id;
        const updatedData = req.body;

        const updatedCard = await UserCard.update({ id }, updatedData);
        res.json(updatedCard);
    },
};

module.exports = userCardController;