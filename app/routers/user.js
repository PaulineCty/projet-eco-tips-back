const { userController } = require("../controllers/index.js");
const debug = require('debug')("router:user");
const validationModule = require("../services/validation/validate");
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const profileRouter = Router();

/**
 * @typedef {import('../models/index').User} User;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route GET /me/user
 * @group User - Getting a user's information
 * @return {User} a User instance
 * @returns {APIError} error
 */
profileRouter.get("/me/user", userController.getProfile);

/**
 * @route PATCH /me/user
 * @group User - Editing a user's information
 * @param {User} user.body.required - User Object
 * @return {object} parts of a User instance hiding any password related information
 * @returns {APIError} error
 */
profileRouter.patch("/me/user", validationModule.validateUserEdition, userController.updateProfile);

/**
 * @route DELETE /me/user
 * @group User - Deleting a user
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
profileRouter.delete("/me/user", userController.deleteProfile);

/**
 * @route GET /user
 * @group User - Getting all existing users
 * @return {User[]} an array of User instances
 * @returns {APIError} error
 */
profileRouter.get("/user", adminMiddleware, userController.getAllUsers);

/**
 * @route PATCH /user
 * @group User - Editing a user's role to administrator
 * @param {number} id - The id of the user to edit
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
profileRouter.patch("/user/:id(\\d+)", adminMiddleware, userController.updateUserAsAdmin);


module.exports = profileRouter;