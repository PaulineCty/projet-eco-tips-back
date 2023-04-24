const APIError = require("../services/error/APIError");
const { Tag } = require("../models/index");
const debug = require('debug')("controller:tag");

const tagController = {
    /**
     * Gets all existing tags
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Tag[]} an array of Tag instances
     * @returns {APIError} error
     */
    async getAll (_, res, next) {
        try {
            const tags = await Tag.findAll();
            // debug(tags);
            res.json(tags);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }        
    },

    /**
     * Creates a tag
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Tag} a Tag instance
     * @returns {APIError} error
     */
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

    /**
     * Updates a tag
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
    async edit (req,res,next) {
        const { name, color } = req.body;
        try {
            const tag = await Tag.update( { id : req.params.id }, { name, color });
            // debug(tag);

            if(!tag) {
                next(new APIError(`La catégorie n'a pas pu être créée.`,400));
            } else {
               res.status(204).json({}); 
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Deletes a tag
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
    async delete (req,res,next) {
        try {
            // deleting a tag also deletes the lines associated with this tag in the tag_card table
            const tag = await Tag.delete(req.params.id);
            // debug(tag);

            if(!tag) {
                next(new APIError(`La catégorie n'a pas pu être supprimée.`,400));
            } else {
               res.status(204).json({}); 
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    }
};

module.exports = tagController;