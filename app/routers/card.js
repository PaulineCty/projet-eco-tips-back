const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:card");
const validationModule = require("../services/validation/validate");

const { Router } = require("express");
const cardRouter = Router();

// cardRouter.patch("/:id", authentificationToken.isAuthenticated, upload.single('image'), cardController.editCard);

cardRouter.get("/", cardController.getAllNotProposalCard);

cardRouter.patch("/:id(\\d+)", validationModule.validateCardEdition, cardController.updateCard);

cardRouter.delete("/:id(\\d+)", cardController.deleteCard);

module.exports = cardRouter;