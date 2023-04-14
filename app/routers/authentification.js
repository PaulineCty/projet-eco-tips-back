const { userAuthController } = require("../controllers/index.js");
const debug = require('debug')("router:authentification");
const validationModule = require("../services/validation/validate");

const { Router } = require("express");
const authentificationRouter = Router();

authentificationRouter.post("/sign-in", userAuthController.signIn);

authentificationRouter.post("/sign-up", validationModule.validateUser, userAuthController.signUp);

module.exports = authentificationRouter;