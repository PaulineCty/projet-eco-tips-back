const fs = require("fs");
const path = require('path');
const APIError = require("../services/error/APIError");
const { Card, TagCard } = require("../models/index");
const debug = require('debug')("controller:card");
const imageService = require('../services/images/imageService');

const cardController = {
    async getUsersCollection (req, res, next) {
        try {
            const cards = await Card.findUserCollection(req.user.id);

            // adding the path to the image names
            cards.forEach(card => {
                card.image = imageService.getImagePath(card.image);
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
            const { image, title, description, environmentalrating, economicrating, value, tags } = req.body;

            const fileParts = image.split(';base64,');
            const extension = fileParts[0].split('/');

            //Removing all punctuation from the card title in order to use it as the image file name
            const imageTitle = title.replace(/[.,\/#!$%\^&\*;:{}= \-_`~()']/g, '').split(' ').join('_').toLowerCase();
            // Converting the base64 into an actual image
            fs.writeFileSync(path.resolve(__dirname,`../../uploads/images/${imageTitle}.${extension[1]}`), fileParts[1], "base64");

            const card = await Card.create({
                image: `${imageTitle}.${extension[1]}`,
                title, 
                description, 
                environmental_rating : environmentalrating, 
                economic_rating: economicrating, 
                value, 
                user_id : req.user.id
            });
            
            //For every tag selected by the user, we create a line in the tag_card table
            let tagCards = [];
            for (const tag of tags) {
                tagCards.push(await TagCard.create({tag_id : tag, card_id : card.id}));
            }
            
            return res.json({card, tagCards});
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    async getOneRandomCard (req, res, next) {
        try {
            const card = await Card.findOneRandomCard(req.user.id);

            // adding the path to the image name
            card.image = imageService.getImagePath(card.image);

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

    async updateProposalCardToFalse (req, res, next) {
        try {
            const updatedCard = await Card.setProposalCardToFalse(req.params.id);
            //do we send a "success" message here using .json() ?
            //do we notice the user if no modification ?
            res.status(204).json();
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    async getAllUsersCards (req, res, next) {
        try {
            //at the moment all cards with the corresponding user_id are returned : maybe the idea would be to have a different style in the Front highlighting the ones that are still in proposal=true so he can see which ones are public and which ones are not ?
            const cards = await Card.findByUser(req.user.id);

            // adding the path to the image names
            cards.forEach(card => {
                card.image = imageService.getImagePath(card.image);
            });
            // debug(cards);
            res.json(cards);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        } 
    }
};

module.exports = cardController;