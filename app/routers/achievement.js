const { achievementController } = require("../controllers/index.js");
const debug = require('debug')("router:achievement");
const validationModule = require("../services/validation/validate");
const authentificationTokenMiddleware = require('../services/authentification/authentificationToken.js');
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const achievementRouter = Router();

/**
 * @route POST /me/achievement
 * @group Achievement - Adding an achievement as proposal
 * @param {Achievement} user.body.required - Achievement Object
 * @return {Achievement} the created Card instance
 * @returns {APIError} error
 */
achievementRouter.post("/me/achievement", authentificationTokenMiddleware.isAuthenticated, validationModule.validateAchievementCreation, achievementController.addAchievement);

/**
 * @route GET /achievement/proposal
 * @group Achievement - Getting all proposed achievements
 * @return {Achievement[]} an array of Achievement instances
 * @returns {APIError} error
 */
achievementRouter.get("/achievement/proposal", authentificationTokenMiddleware.isAuthenticated, adminMiddleware, achievementController.getAllProposalAchievement)


module.exports = achievementRouter;