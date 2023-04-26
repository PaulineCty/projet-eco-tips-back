const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:card");
const validationModule = require("../services/validation/validate");
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const cardRouter = Router();

/**
 * @typedef {import('../models/index').Card} Card;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route GET /me/card
 * @group Card - Getting all cards created by a user
 * @returns {Card[]} an array of Card instances
 * @returns {APIError} error
 */
cardRouter.get('/me/card', cardController.getAllUsersCards);

/**
 * @route GET /card
 * @group Card - Getting all approved cards
 * @returns {Card[]} an array of Card instances
 * @returns {APIError} error
 */
cardRouter.get("/card", adminMiddleware, cardController.getAllNotProposalCard);

/**
 * @route PATCH /card/:id
 * @group Card - Updating a card
 * @param {number} id - The id of the card to update
 * @param {Card} user.body.required - Card Object
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
cardRouter.patch("/card/:id(\\d+)", adminMiddleware, validationModule.validateCardEdition, cardController.updateCard);

/**
 * @route DELETE /card/:id
 * @group Card - Deleting a card
 * @param {number} id - The id of the card to delete
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
cardRouter.delete("/card/:id(\\d+)", adminMiddleware, cardController.deleteCard);

/**
 * @route GET /card/latest
 * @group Card - Gets the latest created and validated card
 * @returns {Card} a Card instance
 * @returns {APIError} error
 */
cardRouter.get("/card/latest", cardController.getLatestCard);

module.exports = cardRouter;