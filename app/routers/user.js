const { userController } = require("../controllers/index.js");
const debug = require('debug')("router:user");
const validationModule = require("../services/validation/validate");
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const profileRouter = Router();

profileRouter.get("/me/user", userController.getProfile);

profileRouter.patch("/me/user", validationModule.validateUserEdition, userController.updateProfile);

profileRouter.delete("/me/user", userController.deleteProfile);

profileRouter.get("/user", adminMiddleware, userController.getAllUsers);

profileRouter.patch("/user/:id", adminMiddleware, userController.updateUserAsAdmin);


module.exports = profileRouter;