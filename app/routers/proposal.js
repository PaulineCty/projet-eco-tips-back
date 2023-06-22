const APIError = require("../services/error/APIError");
const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:proposal");
const validationModule = require("../services/validation/validate");
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const proposalRouter = Router();

/**
 * @typedef {import('../models/index').Card} Card;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route GET /proposal
 * @group Card - Getting all proposed cards
 * @return {Card[]} an array of Card instances
 * @returns {APIError} error
 */
proposalRouter.get("/proposal", adminMiddleware, cardController.getAllProposalCard);


/**
 * @route PATCH /proposal/:id
 * @group Card - Updating a card to an approved state
 * @param {number} id - The id of the card to update
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
proposalRouter.patch("/proposal/:id(\\d+)", adminMiddleware, cardController.updateProposalCardToFalse);

module.exports = proposalRouter;