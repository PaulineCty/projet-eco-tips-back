const { tagController } = require("../controllers/index.js");
const debug = require('debug')("router:tag");
const validationModule = require("../services/validation/validate");
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const tagRouter = Router();

/**
 * @typedef {import('../models/index').Tag} Tag;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route GET /tag
 * @group Tag - Getting all existing tags
 * @return {Tag[]} an array of Tag instances
 * @returns {APIError} error
 */
tagRouter.get("/", tagController.getAll);

/**
 * @route POST /tag
 * @group Tag - Creating a new tag
 * @param {Tag} user.body.required - Tag Object
 * @return {Tag} the created Tag instance
 * @returns {APIError} error
 */
tagRouter.post("/", adminMiddleware, validationModule.validateTagCreation, tagController.create);

/**
 * @route PATCH /tag
 * @group Tag - Editing a tag
 * @param {number} id - The id of the tag to update
 * @param {Tag} user.body.required - Tag Object
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
tagRouter.patch("/:id(\\d+)", adminMiddleware, validationModule.validateTagEdition, tagController.edit);

/**
 * @route DELETE /tag
 * @group Tag - Deleting a tag
 * @param {number} id - The id of the tag to delete
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
tagRouter.delete("/:id(\\d+)", adminMiddleware, tagController.delete);

module.exports = tagRouter;