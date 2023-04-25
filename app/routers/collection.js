const { cardController } = require("../controllers/index.js");
const { userCardController } = require("../controllers/index.js");
const debug = require('debug')("router:collection");

const { Router } = require("express");
const collectionRouter = Router();

/**
 * @typedef {import('../models/index').Card} Card;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route GET /me/collection
 * @group Card - Getting the user's card collection
 * @returns {Card[]} an array of Card instances
 * @returns {APIError} error
 */
collectionRouter.get("/", cardController.getUsersCollection);


/**
 * @route GET /me/collection/card
 * @group Card - Getting one random card as a suggestion to the user
 * @returns {Card} a Card instance
 * @returns {APIError} error
 */
collectionRouter.get("/card", cardController.getOneRandomCard);


/**
 * @route POST /me/collection/card
 * @group Usercard - Adding the suggested card to the user's card collection
 * @param {Card} user.body.required - Card Object
 * @return {Card} the created Card instance
 * @returns {APIError} error
 */
collectionRouter.post("/card", userCardController.addUserCard);


/**
 * @route PATCH /me/collection/card/:cardId
 * @group Usercard - Updating the card status in the user's card collection
 * @param {number} cardId - The id of the card to update
 * @returns {void} 204 - No content response
 * @returns {APIError} error
 */
collectionRouter.patch("/card/:cardId(\\d+)", userCardController.updateUserCardState);


/**
 * @route DELETE /me/collection/card/:cardId
 * @group Usercard - Deleting the card from the user's card collection
 * @param {number} cardId - The id of the card to delete
 * @returns {void} 204 - No content response
 * @returns {APIError} error
 */
collectionRouter.delete("/card/:cardId(\\d+)", userCardController.deleteUserCard);

module.exports = collectionRouter;