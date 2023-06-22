const { userController } = require("../controllers/index.js");
const debug = require('debug')("router:ranking");

const { Router } = require("express");
const rankingRouter = Router();

/**
 * @typedef {import('../models/index').User} User;
 * @typedef {import('../services/error/APIError')} APIError;
 */



module.exports = rankingRouter;