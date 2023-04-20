const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:card");

const { Router } = require("express");
const cardRouter = Router();

// cardRouter.patch("/:id", authentificationToken.isAuthenticated, upload.single('image'), cardController.editCard);

module.exports = cardRouter;