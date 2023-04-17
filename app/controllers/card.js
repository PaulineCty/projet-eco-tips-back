const APIError = require("../services/error/APIError");
const { Card } = require("../models/index");
const debug = require('debug')("controller:card");

const cardController = {
    async getByUser (req, res, next) {
        try {
            const cards = await Card.findByUser(req.user.id);
            // debug(cards);
            res.json(cards);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }        
    },

    async addCard (req, res, next) {
        try {
            // CAREFUL : form names have to be the exact same than the table field name 
            // using multer to get the req.file
            // const blobImage = req.file.buffer.toString('base64');
            // const card = await Card.create({...req.body, image : blobImage, user_id : req.user.id});
            const card = await Card.create({...req.body, user_id : req.user.id});
            // debug(card);
            res.json(card);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    async getOneRandomCard (req, res, next) {
        try {
            const card = await Card.getOneRandomCard(req.user.id);
            // debug(card);
            res.json(card);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

    }
};

module.exports = cardController;