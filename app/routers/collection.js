const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:collection");

const { Router } = require("express");
const collectionRouter = Router();

collectionRouter.get("/:id(\\d+)", cardController.getByUser);

module.exports = collectionRouter;