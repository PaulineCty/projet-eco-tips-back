const { UserCard } = require("../models/index");
const debug = require('debug')("controller:usercard");

const userCardController = {
    async updateUserCardState (req, res) {
        const id = req.params.id;
        const updatedData = req.body;

        const updatedCard = await UserCard.update({ id }, updatedData);
        res.json(updatedCard);
    },

    async addUserCard (req, res) {
        const cards = await UserCard.create(req.body);

        debug(cards);
        res.json(cards);
    },

    async deleteUserCard (req, res) {
        const cards = await UserCard.deleteUserCard(req.params.id, req.params.cardId);
        debug(cards);
        res.json(cards); // ou res.status(204).json() ?;
    }
};

module.exports = userCardController;