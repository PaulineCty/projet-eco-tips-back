const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:card");
const validationModule = require("../services/validation/validate");
const authentificationTokenMiddleware = require('../services/authentification/authentificationToken.js');
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const cardRouter = Router();

/**
 * @typedef {import('../models/index').Card} Card;
 * @typedef {import('../models/index').TagCard} TagCard;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route GET /card
 * @group Card - Getting all approved cards
 * @returns {Card[]} an array of Card instances
 * @returns {APIError} error
 */
cardRouter.get("/card", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, cardController.getAllNotProposalCard);

/**
 * @route GET /proposal
 * @group Card - Getting all proposed cards
 * @return {Card[]} an array of Card instances
 * @returns {APIError} error
 */
cardRouter.get("/card/proposal", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, cardController.getAllProposalCard);


/**
 * @route GET /card/latest
 * @group Card - Gets the latest created and validated card
 * @returns {Card} a Card instance
 * @returns {APIError} error
 */
cardRouter.get("/card/latest", cardController.getLatestCard);

/**
 * @route PATCH /proposal/:id
 * @group Card - Updating a card to an approved state
 * @param {number} id - The id of the card to update
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
cardRouter.patch("/card/proposal/:id(\\d+)", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, cardController.updateProposalCardToFalse);

/**
 * @route PATCH /card/:id
 * @group Card - Updating a card
 * @param {number} id - The id of the card to update
 * @param {Card} user.body.required - Card Object
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
cardRouter.patch("/card/:id(\\d+)", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, validationModule.validateCardEdition, cardController.updateCard);

/**
 * @route DELETE /card/:id
 * @group Card - Deleting a card
 * @param {number} id - The id of the card to delete
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
cardRouter.delete("/card/:id(\\d+)", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, cardController.deleteCard);

/**
 * @route GET /me/card
 * @group Card - Getting all cards created by a user
 * @returns {Card[]} an array of Card instances
 * @returns {APIError} error
 */
cardRouter.get('/me/card', authentificationTokenMiddleware.isAuthenticated, cardController.getAllUsersCards);

/**
 * @route POST /me/card
 * @group Card - Adding a card as proposal
 * @group TagCard - Adding one or many tags to the card
 * @param {Card} user.body.required - Card Object
 * @return {Card} the created Card instance
 * @return {TagCard[]} an array of the created TagCard instances
 * @returns {APIError} error
 */
cardRouter.post("/me/card", authentificationTokenMiddleware.isAuthenticated, validationModule.validateCardCreation, cardController.addCard);


module.exports = cardRouter;