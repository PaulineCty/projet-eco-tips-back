const APIError = require("../services/error/APIError");
const { UserCard } = require("../models/index");
const debug = require('debug')("controller:usercard");

/**
 * @typedef {import('../models/index').UserCard} UserCard;
 * @typedef {import('../services/error/APIError')} APIError;
 */

const userCardController = {
    /**
     * Updates a specific card's state
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     */
    async updateUserCardState (req, res, next) {
        try {
            const card = await UserCard.updateUserCardState(req.user.id, req.params.cardId);

            if(!card) {
                next(new APIError(`Cette carte ne peut pas être validée pour le moment.`,400));
            } else {
                res.status(204).json();
            }

        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Creates a new instance in the user_card's table
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {UserCard} the created Card instance
     */
    async addUserCard (req, res, next) {
        try {
            // checking if the card is already in the user's card collection
            const userCard = await UserCard.findUserCardByIds(req.user.id, req.body.cardId);

            if(userCard) {
                next(new APIError(`Cette carte est déjà dans votre collection.`,400))
            } else {
                const userCard = await UserCard.create({user_id : req.user.id, card_id : req.body.cardId, expiration_date : req.body.expirationDate});
                // debug(cards);
                res.json(userCard);
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Deletes an instance in the user_card's table
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     */
    async deleteUserCard (req, res, next) {
        try {
            const card = await UserCard.deleteUserCard(req.user.id, req.params.cardId);

            if(!card) {
                next(new APIError(`Cette carte n'a pas pu être supprimée.`,400));
            } else {
                res.status(204).json();
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    }
};

module.exports = userCardController;