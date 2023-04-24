const APIError = require("../services/error/APIError");
const { UserCard } = require("../models/index");
const debug = require('debug')("controller:usercard");

const userCardController = {
    /**
     * Update the card's state
     * @param {object} req Express's request
     * @param {object} res Express's response
     * @param {function} next - Express.js middleware next function
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
     * Create a new card in the user_card's table
     * @param {object} req Express's request
     * @param {object} res Express's response
     * @param {function} next - Express.js middleware next function
     * @return {object} return an object with all the card's data
     */
    async addUserCard (req, res, next) {
        try {
            // checking if the card is already in the user's card collection
            const userCard = await UserCard.findUserCardByIds(req.user.id, req.body.cardId);

            if(userCard) {
                next(new APIError(`Cette carte est déjà dans votre collection.`,400))
            } else {
                const card = await UserCard.create({user_id : req.user.id, card_id : req.body.cardId, expiration_date : req.body.expirationDate});
                // debug(cards);
                res.json(card);
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Delete an user's card in the user_card's table
     * @param {object} req Express's request
     * @param {object} res Express's response
     * @param {function} next - Express.js middleware next function
     * @returns {void} - No Content (HTTP 204) response
     */
    async deleteUserCard (req, res, next) {
        try {
            const card = await UserCard.deleteUserCard(req.user.id, req.params.cardId);
            //do we send a "success" message here using .json() ?
            //do we notice the user if no deletion ?
            // if(card) {
            //     res.status(204).json();
            // }
            // debug(card);
            res.status(204).json();
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    }
};

module.exports = userCardController;