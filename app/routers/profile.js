const { userController } = require("../controllers/index.js");
const debug = require('debug')("router:authentification");
const validationModule = require("../services/validation/validate");

const { Router } = require("express");
const profileRouter = Router();


profileRouter.get("/", userController.getProfile);

profileRouter.patch("/", validationModule.validateUser , userController.updateProfile);

module.exports = profileRouter;