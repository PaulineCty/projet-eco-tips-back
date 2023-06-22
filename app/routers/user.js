const { userController } = require("../controllers/index.js");
const debug = require('debug')("router:user");
const validationModule = require("../services/validation/validate");
const adminMiddleware = require('../services/authentification/isAdmin.js');

const { Router } = require("express");
const userRouter = Router();

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
userRouter.get("/me/user", userController.getProfile);

/**
 * @route PATCH /me/user
 * @group User - Editing a user's information (password not included)
 * @param {User} user.body.required - User Object
 * @return {object} parts of a User instance hiding any password related information
 * @returns {APIError} error
 */
userRouter.patch("/me/user", validationModule.validateUserEdition, userController.updateProfile);

/**
 * @route PATCH /me/user/password
 * @group User - Editing a user's password
 * @param {User} user.body.required - User Object
 * @return {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
userRouter.patch("/me/user/password", validationModule.validateUserPasswordEdition, userController.updatePassword);

/**
 * @route DELETE /me/user
 * @group User - Deleting a user
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
userRouter.delete("/me/user", userController.deleteProfile);


/**
 * @route GET /user
 * @group User - Getting all existing users
 * @return {User[]} an array of User instances
 * @returns {APIError} error
 */
userRouter.get("/user", adminMiddleware, userController.getAllUsers);

/**
 * @route GET /user/score
 * @group User - Gets the 5 best user's ordered by score
 * @returns {User[]} an array of User instances
 * @returns {APIError} error
 */
userRouter.get("/user/score", userController.getUserByScore);

/**
 * @route GET /user/creation
 * @group User - Gets the 5 best users ordered by card creation
 * @returns {User[]} an array of User instances
 * @returns {APIError} error
 */
userRouter.get("/user/creation", userController.getUserByCardCreation);

/**
 * @route PATCH /user
 * @group User - Editing a user's role to administrator
 * @param {number} id - The id of the user to edit
 * @returns {void} - No Content (HTTP 204) response
 * @returns {APIError} error
 */
userRouter.patch("/user/:id(\\d+)", adminMiddleware, userController.updateUserAsAdmin);


module.exports = userRouter;