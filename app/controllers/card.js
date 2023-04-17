const APIError = require("../services/error/APIError");
const { Card, TagCard } = require("../models/index");
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
            // CAREFUL : form names have to be the exact same than the table field name --> tags for tag_ids ?

            // using multer to get the req.file
            // const blobImage = req.file.buffer.toString('base64');
            // const card = await Card.create({...req.body, image : blobImage, user_id : req.user.id});

            const { image, title, description, environmental_rating, economic_rating, value, tags } = req.body;
            const card = await Card.create({image, title, description, environmental_rating, economic_rating, value, user_id : req.user.id});

            //For every tag selected by the user, we create a line in the tag_card table
            for (const tag of tags) {
                await TagCard.create({tag_id : tag, card_id : card.id});
            }
            
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