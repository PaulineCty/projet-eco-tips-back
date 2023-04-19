const { tagController } = require("../controllers/index.js");
const debug = require('debug')("router:tag");
const validationModule = require("../services/validation/validate");

const { Router } = require("express");
const tagRouter = Router();

// Getting all tags
tagRouter.get("/", tagController.getAll);

tagRouter.post("/", validationModule.validateNewTag, tagController.create);

tagRouter.patch("/:id", validationModule.validateTagEdition, tagController.edit);

tagRouter.delete("/:id", tagController.delete);

module.exports = tagRouter;