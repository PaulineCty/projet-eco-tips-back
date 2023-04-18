const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:card");
const authentificationToken = require('../services/authentification/authentificationToken');

const { Router } = require("express");
const cardRouter = Router();

// cardRouter.patch("/", authentificationToken.isAuthenticated, cardController.updateUserCardState);

module.exports = cardRouter;