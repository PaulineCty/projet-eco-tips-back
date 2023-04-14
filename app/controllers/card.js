const { Card } = require("../models/index");
const debug = require('debug')("controller:card");

const cardController = {
<<<<<<< HEAD
    async getByUser (req, res, next) {
        // CAREFUL : userId will be found in req.user using JWT
        try {
            const cards = await Card.findByUser(req.params.id);
            // debug(cards);
            res.json(cards);
        } catch (error) {
            //next(new APIError(`Erreur interne : ${error}`,500));
        }        
=======
    async getByUser (req, res) {
        const cards = await Card.findByUser(req.params.id);
        // const cards = await Card.findAll();
        debug(req.user);
>>>>>>> 1f4d2c3044de3df8aa2b4e7561c2b1d51edb60db
    },

    async addCard (req, res, next) {
        try {
            // CAREFUL : form names have to be the exact same than the table field name 
            // CAREFUL : userId will be found in req.user using JWT
            const card = await Card.create({...req.body, user_id : req.params.id});
            // debug(card);
            res.json(card);
        } catch (error) {
            //next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    async getOneRandomCard (req, res, next) {
        try {
            // CAREFUL : userId will be found in req.user using JWT
            const card = await Card.getOneRandomCard(req.params.id);
            // debug(card);
            res.json(card);
        } catch (error) {
            //next(new APIError(`Erreur interne : ${error}`,500));
        }

    }
};

module.exports = cardController;