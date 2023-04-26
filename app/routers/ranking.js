const { userController } = require("../controllers/index.js");
const debug = require('debug')("router:ranking");

const { Router } = require("express");
const rankingRouter = Router();

/**
 * @typedef {import('../models/index').User} User;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route GET /ranking/score
 * @group User - Gets the 5 best user's ordered by score
 * @returns {User[]} an array of User instances
 * @returns {APIError} error
 */
rankingRouter.get("/score", userController.getRankingScore);

/**
 * @route GET /ranking/creation
 * @group User - Gets the 5 best user's ordered by card creation
 * @returns {User[]} an array of User instances
 * @returns {APIError} error
 */
// rankingRouter.get("/creation", userController.getRanking);

module.exports = rankingRouter;