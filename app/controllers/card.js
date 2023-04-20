const fs = require("fs");
const path = require('path');
const APIError = require("../services/error/APIError");
const { Card, TagCard } = require("../models/index");
const debug = require('debug')("controller:card");

const cardController = {
    async getByUser (req, res, next) {
        try {
            const cards = await Card.findByUser(req.user.id);

            //converting the image_data to base64
            // cards.forEach(card => {
            //     card.image_data = card.image_data.toString('base64');
            // });

            // debug(cards);
            res.json(cards);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }        
    },

    async addCard (req, res, next) {
        try {
            // CAREFUL : form names have to be the exact same than the table field name --> tags for tag_ids ?
            const { image, title, description, environmental_rating, economic_rating, value, tags } = req.body;

            // Converting the base64 into an actual image
            const buffer = Buffer.from(image, "base64");
            //Removing all punctuation from the card title in order to use it as the image file name
            const imageTitle = title.replace(/[.,\/#!$%\^&\*;:{}= \-_`~()']/g, '').split(' ').join('_').toLowerCase();
            fs.writeFileSync(path.resolve(__dirname,`../../uploads/images/${imageTitle}.png`), buffer);

            const card = await Card.create({
                image: `/uploads/images/${imageTitle}.png`,
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

            // card.image_data = card.image_data.toString('base64');

            // debug(card);
            res.json(card);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

    },

    //obsolete now
    // async editCard (req, res, next) {
    //     try {
    //         //Temporary controller, just modifying the image for now
    //         const updatedCard = await Card.update({id: req.params.id},{
    //             image_type: req.file.mimetype,
    //             image_name: req.file.originalname,
    //             image_data: req.file.buffer
    //         });
    //         // debug(updatedCard);
    //         res.json(updatedCard);
    //     } catch (error) {
    //         next(new APIError(`Erreur interne : ${error}`,500));
    //     }
    // }

    async getAllProposalCard (req, res, next) {
        try {
            const card = await Card.findAllProposals();

            // debug(card);
            res.json(card);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

    },

    async setProposalCardToFalse (req, res, next) {
        try {
            const updatedCard = await Card.setProposalCardToFalse(req.params.id);
            //do we send a "success" message here using .json() ?
            //do we notice the user if no modification ?
            res.status(204).json();
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },
};

module.exports = cardController;