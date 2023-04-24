const { userController } = require("../controllers/index.js");
const debug = require('debug')("router:authentification");
const validationModule = require("../services/validation/validate");

const { Router } = require("express");
const authentificationRouter = Router();

/**
 * @typedef {import('../models/index').User} User;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route POST /sign-in
 * @group User - Managing sign in
 * @param {User} user.body.required - User Object
 * @returns {object} 200 - Jwt's access token, user's firstname an user's role_id
 * @returns {APIError} error
 */
authentificationRouter.post("/sign-in", userController.signIn);


/**
 * @route POST /sign-up
 * @group User - Managing sign up
 * @returns {object} 200 - Jwt's access token, user's firstname an user's role_id
 * @returns {APIError} error
 */
authentificationRouter.post("/sign-up", validationModule.validateUserCreation, userController.signUp);

module.exports = authentificationRouter;