const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:card");
const validationModule = require("../services/validation/validate");
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const cardRouter = Router();

cardRouter.get('/me/card', cardController.getAllUsersCards)

// cardRouter.patch("/:id", authentificationToken.isAuthenticated, upload.single('image'), cardController.editCard);

cardRouter.get("/card", adminMiddleware, cardController.getAllNotProposalCard);

cardRouter.patch("/card/:id(\\d+)", adminMiddleware, validationModule.validateCardEdition, cardController.updateCard);

cardRouter.delete("/card/:id(\\d+)", adminMiddleware, cardController.deleteCard);

module.exports = cardRouter;