const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:collection");
const authentificationToken = require('../services/authentification/authentificationToken');

const { Router } = require("express");
const collectionRouter = Router();

collectionRouter.get("/:id(\\d+)", authentificationToken.isAuthenticated, cardController.getByUser);

module.exports = collectionRouter;