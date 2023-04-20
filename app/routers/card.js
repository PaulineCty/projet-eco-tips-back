const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:card");

const { Router } = require("express");
const cardRouter = Router();

cardRouter.get('/me/card', cardController.getAllUsersCards)

// cardRouter.patch("/:id", authentificationToken.isAuthenticated, upload.single('image'), cardController.editCard);

module.exports = cardRouter;