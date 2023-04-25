const { tagController } = require("../controllers/index.js");
const debug = require('debug')("router:tag");
const validationModule = require("../services/validation/validate");
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const tagRouter = Router();

// Getting all tags
tagRouter.get("/", tagController.getAllTags);

tagRouter.post("/", adminMiddleware, validationModule.validateTagCreation, tagController.createTag);

tagRouter.patch("/:id(\\d+)", adminMiddleware, validationModule.validateTagEdition, tagController.editTag);

tagRouter.delete("/:id(\\d+)", adminMiddleware, tagController.deleteTag);

module.exports = tagRouter;