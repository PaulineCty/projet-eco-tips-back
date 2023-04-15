const { cardController } = require("../controllers/index.js");
const { userCardController } = require("../controllers/index.js");
const debug = require('debug')("router:collection");
const authentificationToken = require('../services/authentification/authentificationToken');

const { Router } = require("express");
const collectionRouter = Router();

// Getting the user's card collection
collectionRouter.get("/", authentificationToken.isAuthenticated, cardController.getByUser);

// Getting one random card to suggest to the user
collectionRouter.get("/card", authentificationToken.isAuthenticated, cardController.getOneRandomCard);

// Adding the suggested card to the user's card collection
collectionRouter.post("/card", authentificationToken.isAuthenticated, userCardController.addUserCard);

// Updating the card status in the user's card collection
collectionRouter.patch("/card/:cardId(\\d+)", authentificationToken.isAuthenticated, userCardController.updateUserCardState);

// Deleting the card from the user's card collection
collectionRouter.delete("/card/:cardId(\\d+)", authentificationToken.isAuthenticated, userCardController.deleteUserCard);

module.exports = collectionRouter;