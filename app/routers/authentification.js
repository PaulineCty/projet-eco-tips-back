const { userController } = require("../controllers/index.js");
const debug = require('debug')("router:authentification");
const validationModule = require("../services/validation/validate");

const { Router } = require("express");
const authentificationRouter = Router();


/**
 * @route POST /sign-in
 * @group User - Managing sign in
 * @param {User} user.body.required - Object User
 * @returns {object} 200 - Jwt's access token and user's firstname
 * @returns {Error}  default - Unexpected error
 */
authentificationRouter.post("/sign-in", userController.signIn);


/**
 * @route POST /sign-up
 * @group User - Managing sign up
 * @returns {object} 200 - Jwt's access token and user's firstname
 * @returns {Error}  default - Unexpected error
 */
authentificationRouter.post("/sign-up", validationModule.validateUserCreation, userController.signUp);

module.exports = authentificationRouter;