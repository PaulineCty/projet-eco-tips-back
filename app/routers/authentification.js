const { userAuthController } = require("../controllers/index.js");
const debug = require('debug')("router:authentification");
const validationModule = require("../services/validation/validate");

const { Router } = require("express");
const authentificationRouter = Router();

// Managing sign in
authentificationRouter.post("/sign-in", userAuthController.signIn);

// Managing sign up
authentificationRouter.post("/sign-up", validationModule.validateUser, userAuthController.signUp);

module.exports = authentificationRouter;