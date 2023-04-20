const { cardController } = require("../controllers/index.js");
const { userCardController } = require("../controllers/index.js");
const debug = require('debug')("router:collection");

const { Router } = require("express");
const collectionRouter = Router();


/**
 * @route GET /me/collection
 * @group Card - Getting the user's card collection
 * @returns {object} 200 - User's card collection data
 * @returns {Error}  default - Unexpected error
 */
collectionRouter.get("/", cardController.getByUser);


/**
 * @route GET /me/collection/card
 * @group Card - Getting one random card to suggest to the user
 * @returns {object} 200 - Random card's data data (not owned by user)
 * @returns {Error}  default - Unexpected error
 */
collectionRouter.get("/card", cardController.getOneRandomCard);


/**
 * @route POST /me/collection/card
 * @group Usercard - Adding the suggested card to the user's card collection
 * @param {import('./proposal').Card} user.body.required - Object Card
 * @param {import('../../models/Card').Card} user.body.required - Object Card
 * @returns {object} 200 - New usercard's data
 * @returns {Error}  default - Unexpected error
 */
collectionRouter.post("/card", userCardController.addUserCard);


/**
 * @route PATCH /me/collection/card/:cardId
 * @group Usercard - Updating the card status in the user's card collection
 * @returns {void} 204 - No content response
 * @returns {Error}  default - Unexpected error
 */
collectionRouter.patch("/card/:cardId(\\d+)", userCardController.updateUserCardState);


/**
 * @route DELETE /me/collection/card/:cardId
 * @group Usercard - Deleting the card from the user's card collection
 * @returns {void} 204 - No content response
 * @returns {Error}  default - Unexpected error
 */
collectionRouter.delete("/card/:cardId(\\d+)", userCardController.deleteUserCard);

module.exports = collectionRouter;