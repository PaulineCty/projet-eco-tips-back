const fs = require("fs");
const path = require('path');
const APIError = require("../services/error/APIError");
const { Card, TagCard } = require("../models/index");
const debug = require('debug')("controller:card");
const imageService = require('../services/images/imageService');
const { log } = require("console");

/**
 * @typedef {import('../models/index').Card} Card;
 * @typedef {import('../models/index').TagCard} TagCard;
 * @typedef {import('../services/error/APIError')} APIError;
 */

const cardController = {
    /**
     * Gets all cards belonging to a user's collection
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Card[]} an array of Card instances
     * @returns {APIError} error
     */
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

    /**
     * Adds a card to the card table as a proposal
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Card} the created Card instance
     * @return {TagCard[]} an array of the created TagCard instances
     * @returns {APIError} error
     */
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
                economic_rating : economicrating, 
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

    /**
     * Gets a random card not already owned by the user
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Card} a Card instance
     * @returns {APIError} error
     */
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

    /**
     * Gets all cards that are not approved yet
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Card[]} an array of Card instances
     * @returns {APIError} error
     */
    async getAllProposalCard (req, res, next) {
        try {
            const cards = await Card.findAllProposals();

            // adding the path to the image names
            cards.forEach(card => {
                card.image = imageService.getImagePath(card.image);
            });
            // debug(card);
            res.json(cards);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Updates a card to an approved state
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
    async updateProposalCardToFalse (req, res, next) {
        try {
            const updatedCard = await Card.setProposalCardToFalse(req.params.id);

            if(!updatedCard) {
                next(new APIError(`La carte n'a pas pu être validée.`,400));
            } else {
                res.status(204).json();
            }
            res.status(204).json();
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Gets all cards created by the user
     * @param {object} req Express's request
     * @param {object} res Express's response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Card[]} an array of Card instances
     * @returns {APIError} error
     */
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
    },

    /**
     * Gets all approved cards
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Card[]} an array of Card instances
     * @returns {APIError} error
     */
    async getAllNotProposalCard (req, res, next) {
        try {
            const card = await Card.findAllNotProposals();

            // debug(card);
            res.json(card);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Updates a specific card
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
    async updateCard (req, res, next) {
        const { title, description, environmentalrating, economicrating, value, tags } = req.body;

        // We don't know yet how the front will work so for now we assume that req.body.image will be null if there is no image change
        // Careful with validation because at the moment req.body.image is not required, let's see what we can do about this later
        const previousCard = await Card.findByPk(req.params.id);
        let image;
        if(req.body.image) {
            //removing the previous image
            fs.unlinkSync(`uploads/images/${previousCard.image}`);

            const fileParts = req.body.image.split(';base64,');
            const extension = fileParts[0].split('/');
            //Removing all punctuation from the card title in order to use it as the image file name
            const imageTitle = title.replace(/[.,\/#!$%\^&\*;:{}= \-_`~()']/g, '').split(' ').join('_').toLowerCase();
            // Converting the base64 into an actual image
            fs.writeFileSync(path.resolve(__dirname,`../../uploads/images/${imageTitle}.${extension[1]}`), fileParts[1], "base64");

            // new image column value
            image = `${imageTitle}.${extension[1]}`;
        } else {
            image = previousCard.image;
        }

        try {
            // Finding all tagcard lines associated with the updated card before edition
            const previousTagCards = await TagCard.findByCardId(req.params.id);
            
            // Getting a list of all previous tags existing on this card
            const previousTags = [];
            previousTagCards.forEach( tagcard => previousTags.push(tagcard.tag_id));

            // Getting the difference between the two
            const differenceInPrevious = previousTags.filter(tag => !tags.includes(tag));
            const differenceInNew = tags.filter(tag => !previousTags.includes(tag));
            
            // We delete all tags that are available only before the card edition
            if(differenceInPrevious) {
                await TagCard.deleteByTagCardIds(differenceInPrevious, parseInt(req.params.id));
            }
            
            // We add all tags that are available only in the edition form
            if(differenceInNew) {
                await TagCard.createByTagCardIds(differenceInNew, parseInt(req.params.id));
            }

            const card = await Card.update({id:req.params.id}, {
                image, 
                title, 
                description, 
                environmental_rating : environmentalrating, 
                economic_rating: economicrating, 
                value
            });

            if(!card) {
                next(new APIError(`La carte n'a pas pu être mise à jour.`,400));
            } else {
               res.status(204).json({}); 
            }
            
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Deletes a specific card
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
    async deleteCard (req, res, next) {
        try {
            const card = await Card.delete(req.params.id);

            if(!card) {
                next(new APIError(`La carte n'a pas pu être supprimée.`,400));
            } else {
               res.status(204).json({}); 
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    }

};

module.exports = cardController;