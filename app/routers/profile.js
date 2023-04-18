const { userAuthController } = require("../controllers/index.js");
const debug = require('debug')("router:authentification");
const authentificationToken = require('../services/authentification/authentificationToken');
const validationModule = require("../services/validation/validate");

const { Router } = require("express");
const profileRouter = Router();


profileRouter.get("/", authentificationToken.isAuthenticated, userAuthController.getProfile);

profileRouter.patch("/", authentificationToken.isAuthenticated, validationModule.validateUser , userAuthController.updateProfile);

module.exports = profileRouter;