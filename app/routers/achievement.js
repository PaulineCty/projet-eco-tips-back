const { achievementController } = require("../controllers/index.js");
const debug = require('debug')("router:achievement");
const validationModule = require("../services/validation/validate");
const authentificationTokenMiddleware = require('../services/authentification/authentificationToken.js');
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const achievementRouter = Router();

/**
 * @route GET /achievement
 * @group Achievement - Getting all approved achievements
 * @returns {Achievement[]} an array of Achievement instances
 * @returns {APIError} error
 */
achievementRouter.get("/achievement", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, achievementController.getAllNotProposalAchievement);

/**
 * @route GET /achievement/proposal
 * @group Achievement - Getting all proposed achievements
 * @return {Achievement[]} an array of Achievement instances
 * @returns {APIError} error
 */
achievementRouter.get("/achievement/proposal", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, achievementController.getAllProposalAchievement);

/**
 * @route GET /achievement/random
 * @group Achievement - Getting one random achievement
 * @returns {Achievement} a Achievement instance
 * @returns {APIError} error
 */
achievementRouter.get("/achievement/random", achievementController.getOneRandomAchievement);

/**
 * @route POST /me/achievement
 * @group Achievement - Adding an achievement as proposal
 * @param {Achievement} user.body.required - Achievement Object
 * @return {Achievement} the created Card instance
 * @returns {APIError} error
 */
achievementRouter.post("/me/achievement", authentificationTokenMiddleware.isAuthenticated, validationModule.validateAchievementCreation, achievementController.addAchievement);


/**
 * @route PATCH /achievement/proposal/:id
 * @group Achievement - Updating an achievement to an approved state
 * @param {number} id - The id of the achievement to update
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
achievementRouter.patch("/achievement/proposal/:id(\\d+)", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, achievementController.updateProposalAchievementToFalse);

/**
 * @route PATCH /achievement/:id
 * @group Achievement - Updating an achievement
 * @param {number} id - The id of the achievement to update
 * @param {Achievement} user.body.required - Achievement Object
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
achievementRouter.patch("/achievement/:id(\\d+)", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, validationModule.validateAchievementEdition, achievementController.updateAchievement);

/**
 * @route DELETE /achievement/:id
 * @group Achievement - Deleting an achievement
 * @param {number} id - The id of the achievement to delete
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
achievementRouter.delete("/achievement/:id(\\d+)", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, achievementController.deleteAchievement);

module.exports = achievementRouter;