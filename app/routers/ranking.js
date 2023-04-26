const { userController } = require("../controllers/index.js");
const debug = require('debug')("router:ranking");

const { Router } = require("express");
const rankingRouter = Router();

/**
 * @typedef {import('../models/index').User} User;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route GET /ranking
 * @group User - Gets the 5 best user's order by score
 * @returns {User[]} an array of User instances
 * @returns {APIError} error
 */
rankingRouter.get("/", userController.getRanking);

module.exports = rankingRouter;