const APIError = require("../services/error/APIError");
const { Tag } = require("../models/index");
const debug = require('debug')("controller:tag");

const tagController = {
    async getAll (_, res, next) {
        try {
            const tags = await Tag.findAll();
            // debug(tags);
            res.json(tags);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }        
    }
};

module.exports = tagController;