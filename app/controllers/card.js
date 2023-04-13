// import { Card } from "../models/Card.js";
const Card = require("../model/Card");
import Debug from 'debug';
const debug = Debug("controller:card");

export const cardController = {
    async getByUser (req, res) {
        // const cards = await Card.findByUser(req.params.id);
        const cards = await Card.findAll();
        debug(cards);
    },
};
