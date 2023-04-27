const fs = require("fs");
const path = require('path');
const APIError = require("../services/error/APIError");
const { Achievement } = require("../models/index");
const debug = require('debug')("controller:achievement");

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
     * @return {Achievement} the created Card instance
     * @returns {APIError} error
     */
    async addAchievement (req, res, next) {
        try {
            // CAREFUL : form names have to be the exact same than the table field name --> tags for tag_ids ?
            const { title, image, description } = req.body;

            const fileParts = image.split(';base64,');
            const extension = fileParts[0].split('/');

            //Removing all punctuation from the card title in order to use it as the image file name
            const imageTitle = title.replace(/[.,\/#!$%\^&\*;:{}= \-_`~()']/g, '').split(' ').join('_').toLowerCase();
            // Converting the base64 into an actual image
            fs.writeFileSync(path.resolve(__dirname,`../../uploads/achievementImages/${imageTitle}.${extension[1]}`), fileParts[1], "base64");

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
}


module.exports = achievementController;