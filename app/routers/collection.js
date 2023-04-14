const { cardController } = require("../controllers/index.js");
const { userCardController } = require("../controllers/index.js");
const debug = require('debug')("router:collection");
const authentificationToken = require('../services/authentification/authentificationToken');

const { Router } = require("express");
const collectionRouter = Router();

collectionRouter.get("/:id(\\d+)", authentificationToken.isAuthenticated, cardController.getByUser);

collectionRouter.patch("/:id(\\d+)/edit/:cardId(\\d+)", userCardController.updateUserCardState);

collectionRouter.post("/:id(\\d+)/create", cardController.addCard);

collectionRouter.get("/:id(\\d+)/add", cardController.getOneRandomCard);

collectionRouter.post("/:id(\\d+)/add", userCardController.addUserCard);

collectionRouter.delete("/:id(\\d+)/delete/:cardId(\\d+)", userCardController.deleteUserCard);

module.exports = collectionRouter;