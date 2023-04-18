const { tagController } = require("../controllers/index.js");
const debug = require('debug')("router:tag");
const authentificationToken = require('../services/authentification/authentificationToken');

const { Router } = require("express");
const tagRouter = Router();

// Getting all tags
tagRouter.get("/", authentificationToken.isAuthenticated, tagController.getAll);

module.exports = tagRouter;