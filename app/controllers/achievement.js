const fs = require("fs");
const path = require('path');
const APIError = require("../services/error/APIError");
const { Achievement } = require("../models/index");
const debug = require('debug')("controller:achievement");
const getImagePath = require('../services/images/imageService');

const achievementController = {

    /**
     * @typedef {import('../models/index').Achievement} Achievement;
     * @typedef {import('../services/error/APIError')} APIError;
     */

    /**
     * Adds a achievement to the achievement table as a proposal
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Achievement} the created Achievement instance
     * @returns {APIError} error
     */
    async addAchievement (req, res, next) {
        try {
            // CAREFUL : form names have to be the exact same than the table field name --> tags for tag_ids ?
            const { title, image, description } = req.body;

            const fileParts = image.split(';base64,');
            const extension = fileParts[0].split('/');

            //Removing all punctuation from the achievement title in order to use it as the image file name
            const imageTitle = title.replace(/[.,\/#!$%\^&\*;:{}= \-_`~()']/g, '').split(' ').join('_').toLowerCase();
            // Converting the base64 into an actual image
            fs.writeFileSync(path.resolve(__dirname,`../../uploads/images/achievements/${imageTitle}.${extension[1]}`), fileParts[1], "base64");

            const achievement = await Achievement.create({
                title,
                image: `${imageTitle}.${extension[1]}`,
                description, 
                user_id : req.user.id
            });
            return res.json({achievement});
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Gets all achievement that are not approved yet
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Achievement[]} an array of Achievement instances
     * @returns {APIError} error
     */
    async getAllProposalAchievement (req, res, next) {
        try {
            const achievements = await Achievement.findAllProposals();

            // adding the path to the image names
            achievements.forEach(achievement => {
                achievement.image = getImagePath.getAchievementImagePath(achievement.image);
            });

            res.json(achievements);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Updates a achievement to an approved state
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
    async updateProposalAchievementToFalse (req, res, next) {
        try {
            const updatedAchievement = await Achievement.setProposalAchievementToFalse(req.params.id);

            if(!updatedAchievement) {
                next(new APIError(`L'accomplissement n'a pas pu être validée.`,400));
            } else {
                res.status(204).json();
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Gets all approved achievements
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Achievement[]} an array of Achievement instances
     * @returns {APIError} error
     */
    async getAllNotProposalAchievement (req, res, next) {
        try {
            const achievements = await Achievement.findAllNotProposals();

            // adding the path to the image names
            achievements.forEach(achievement => {
                achievement.image = getImagePath.getAchievementImagePath(achievement.image);
            });

            res.json(achievements);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Gets a random achievement
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Achievement} a Achievement instance
     * @returns {APIError} error
     */
    async getOneRandomAchievement (req, res, next) {
        try {
            const achievement = await Achievement.findOneRandomAchievement();

            // adding the path to the image name
            if(achievement) {
                achievement.image = getImagePath.getAchievementImagePath(achievement.image);  
              }


            res.json(achievement);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

    },

    /**
     * Deletes an achievement
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
    async deleteAchievement (req,res,next) {
        try {
            const achievement = await Achievement.delete(req.params.id);

            if(!achievement) {
                next(new APIError(`L'accomplissement n'a pas pu être supprimée.`,400));
            } else {
                res.status(204).json({}); 
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

        /**
     * Updates a achievement
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
        async updateAchievement (req,res,next) {
            const { title, description } = req.body;

            const previousAchievement = await Achievement.findByPk(req.params.id);
            let image;
            if(req.body.image) {
                //removing the previous image
                fs.unlinkSync(`uploads/images/achievements/${previousAchievement.image}`);

                const fileParts = req.body.image.split(';base64,');
                const extension = fileParts[0].split('/');
                //Removing all punctuation from the achievement title in order to use it as the image file name
                const imageTitle = title.replace(/[.,\/#!$%\^&\*;:{}= \-_`~()']/g, '').split(' ').join('_').toLowerCase();
                // Converting the base64 into an actual image
                fs.writeFileSync(path.resolve(__dirname,`../../uploads/images/achievements/${imageTitle}.${extension[1]}`), fileParts[1], "base64");

                // new image column value
                image = `${imageTitle}.${extension[1]}`;
            } else {
                image = previousAchievement.image;
            }
            
            try {
                const achievement = await Achievement.update( { id : req.params.id }, { title, image, description });
                debug(achievement);
    
                if(!achievement) {
                    next(new APIError(`L'accomplissement n'a pas pu être créé.`,400));
                } else {
                   res.status(204).json({}); 
                }
            } catch (error) {
                next(new APIError(`Erreur interne : ${error}`,500));
            }
        },
}


module.exports = achievementController;