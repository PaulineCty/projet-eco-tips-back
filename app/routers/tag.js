const { tagController } = require("../controllers/index.js");
const debug = require('debug')("router:tag");
const validationModule = require("../services/validation/validate");
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const tagRouter = Router();

// Getting all tags
tagRouter.get("/", tagController.getAll);

tagRouter.post("/", adminMiddleware, validationModule.validateTagCreation, tagController.create);

tagRouter.patch("/:id", adminMiddleware, validationModule.validateTagEdition, tagController.edit);

tagRouter.delete("/:id", adminMiddleware, tagController.delete);

module.exports = tagRouter;