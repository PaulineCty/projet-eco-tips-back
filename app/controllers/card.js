const APIError = require("../services/error/APIError");
const { Card, TagCard } = require("../models/index");
const debug = require('debug')("controller:card");

const cardController = {
    async getByUser (req, res, next) {
        try {
            const cards = await Card.findByUser(req.user.id);

            //converting the image_data to base64
            cards.forEach(card => {
                card.image_data = card.image_data.toString('base64');
            });

            // debug(cards);
            res.json(cards);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }        
    },

    async addCard (req, res, next) {
        try {
            // CAREFUL : form names have to be the exact same than the table field name --> tags for tag_ids ?

            const { title, description, environmental_rating, economic_rating, value, tags } = req.body;

            const card = await Card.create({
                image_type: req.file.mimetype,
                image_name: req.file.originalname,
                image_data: req.file.buffer,
                title, 
                description, 
                environmental_rating, 
                economic_rating, 
                value, 
                user_id : req.user.id
            });

            //For every tag selected by the user, we create a line in the tag_card table
            let tagCards = [];
            for (const tag of tags) {
                tagCards.push(await TagCard.create({tag_id : tag, card_id : card.id}));
            }
            
            res.json({card, tagCards});
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    async getOneRandomCard (req, res, next) {
        try {
            const card = await Card.getOneRandomCard(req.user.id);

            card.image_data = card.image_data.toString('base64');

            // debug(card);
            res.json(card);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

    },

    //edit image


};

module.exports = cardController;