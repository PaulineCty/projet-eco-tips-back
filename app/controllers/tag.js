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
    },

    async create (req,res,next) {
        const { name, color } = req.body;
        try {
            const tag = await Tag.create({ name, color });
            // debug(tag);
            res.json(tag);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    async edit (req,res,next) {
        const { name, color } = req.body;
        try {
            const tag = await Tag.update( { id : req.params.id }, { name, color });
            // debug(tag);

            //do we send a "success" message here using .json() ?
            //do we notice the user if no modification ?
            res.status(204).json();
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    async delete (req,res,next) {
        try {
            const tag = await Tag.delete(req.params.id);
            // debug(tag);

            //do we send a "success" message here using .json() ?
            //do we notice the user if no modification ?
            res.status(204).json();
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    }
};

module.exports = tagController;