const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:proposal");
const authentificationToken = require('../services/authentification/authentificationToken');
const validationModule = require("../services/validation/validate");

const { Router } = require("express");
const proposalRouter = Router();

/**
 * A card is an object including an image, a title, a description, an environmental_rating, an economic_rating, a value and an user_id
 * @typedef {Object} Card
 * @property {string} image - image
 * @property {string} title - title
 * @property {string} description - description
 * @property {integer} environmental_rating - environmental_rating
 * @property {integer} economic_rating - economic_rating
 * @property {integer} value - value
 * @property {integer} user_id - user_id
 */

/**
 * @route POST /proposal
 * @group Card - Adding a proposal card to the site's cards
 * @param {Card} user.body.required - Object Card
 * @returns {object} 200 - New card's data
 * @returns {Error}  default - Unexpected error
 */
proposalRouter.post("/", authentificationToken.isAuthenticated, validationModule.validateCard,cardController.addCard);

module.exports = proposalRouter;