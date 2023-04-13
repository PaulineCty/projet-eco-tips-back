const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:collection");

const express = require('express');
const collectionRouter = express.Router();

collectionRouter.get("/:id(\\d+)", cardController.getByUser);

module.exports = collectionRouter;