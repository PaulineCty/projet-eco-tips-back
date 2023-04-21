const fs = require("fs");
const path = require('path');
const APIError = require("../services/error/APIError");
const { Card, TagCard } = require("../models/index");
const debug = require('debug')("controller:card");
const imageService = require('../services/images/imageService');
const { log } = require("console");

const cardController = {
    async getByUser (req, res, next) {
        try {
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

    async getOneRandomCard (req, res, next) {
        try {
            const card = await Card.getOneRandomCard(req.user.id);

            // adding the path to the image name
            card.image = imageService.getImagePath(card.image);

            // debug(card);
            res.json(card);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

    },

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

    async getAllNotProposalCard (req, res, next) {
        try {
            const card = await Card.findAllNotProposals();

            // debug(card);
            res.json(card);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    async updateCard (req, res, next) {
        const { title, description, environmentalrating, economicrating, value, tags } = req.body;

        // We don't know yet how the front will work so for now we assume that req.body.image will be null if there is no image change
        // Careful with validation because at the moment req.body.image is not required, let's see what we can do about this later
        const previousCard = await Card.findByPk(req.params.id);
        let image;
        if(req.body.image) {
            console.log(previousCard);
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
                differenceInPrevious.forEach( async tagId => {
                    await TagCard.deleteByTagCardIds(tagId, req.params.id);
                });
            }
            
            // We add all tags that are available only in the edition form
            if(differenceInNew) {
                differenceInNew.forEach( async tagId => {
                    await TagCard.create({tag_id : tagId, card_id : req.params.id});
                });
            }
            
            // let counter = 0
            // for (const tag of tags) {
            //     const tagCard = await TagCard.findByCardId(req.params.id);
            //     await TagCard.update({id: tagCard[counter].id}, {tag_id: tag});
            //     counter += 1
            //     console.log(tagCard);
            //     console.log(tag);
            // };

            const card = await Card.update({id:req.params.id}, {
                image, 
                title, 
                description, 
                environmental_rating : environmentalrating, 
                economic_rating: economicrating, 
                value
            });

            res.status(204).json({});
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    async deleteCard (req, res, next) {
        try {
            const card = await Card.delete(req.params.id);

            // debug(card);
            res.status(204).json();
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },
};

module.exports = cardController;