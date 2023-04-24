const { User } = require("../models/index");
const APIError = require("../services/error/APIError");
const authentificationToken = require('../services/authentification/authentificationToken');

const debug = require('debug')("controller:user");
const bcrypt = require('bcrypt');

/**
 * @typedef {import('../models/index').User} User;
 * @typedef {import('../services/error/APIError')} APIError;
 */

const userController = {

    /**
     * Creates a new user in the User's table
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {object} return an object with jwt's access token, user's firstname and user's role_id
     * @returns {APIError} error
     */
    async signUp(req,res,next) {
        const {firstname, lastname, email, password, birthdate} = req.body;

        // Password encrypting
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating the new user in the user table, only standard users can be created this way (no admin)
        // And generating a token 
        try {
            const newUser = await User.create({firstname, lastname, email, password: hashedPassword, birthdate});

            const accessToken = authentificationToken.generateAccessToken(newUser);
            res.json({ 
                accessToken, 
                firstname : newUser.firstname,
                role_id : newUser.role_id
            });
        } catch (error) {
            next(new APIError("Erreur lors de l'inscription", 500));
        }
        
    },

    /**
     * Verifies a user's connexion form using their email and password
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {object} return an object with jwt's access token, user's firstname and user's role_id
     * @returns {APIError} error
     */
    async signIn (req,res,next) {
        const { email, password } = req.body;
        
        try {
            // Checking if an account exists with this email
            const user = await User.findByEmail(email);
            if(!user) {
                next(new APIError('Couple login/mot de passe est incorrect.', 401));
            } else {
                // Checking if the password is matching
                const hasMatchingPassword = await bcrypt.compare(password, user.password);
                if(!hasMatchingPassword) {
                    next(new APIError('Couple login/mot de passe est incorrect.', 401));
                }

                // Generating a token and redirecting to the home page
                const accessToken = authentificationToken.generateAccessToken(user);
                res.json({ 
                    accessToken, 
                    firstname : user.firstname,
                    role_id : user.role_id
                });
            }

        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

     },
    
    /**
     * Gets a user's information
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {User} a User instance
     * @returns {APIError} error
     */
    async getProfile (req, res, next) {
        try {
            // here we are not returning the password for security reasons
            const user = await User.findByPk(req.user.id);
            // debug(user);
            res.json(user);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }  
    },

    /**
     * Updates a user's information
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {object} parts of a User instance hiding any password related information
     * @returns {APIError} error
     */
    async updateProfile (req, res, next) {

        // Try to create a coalesce SQL request in order to update one to many data 
        // and setup a new validateschema specific profile modification
        const {firstname, lastname, email, password, birthdate} = req.body;

        let hashedPassword;
        if (password && password.trim().length > 0) {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        try {
            const updatedUser = await User.update({id: req.user.id},{firstname, lastname, email, password: hashedPassword, birthdate});

            // Ask to front what information they need
            res.json({ 
                firstname : updatedUser.firstname,
                lastname : updatedUser.lastname,
                email : updatedUser.email,
                birthdate : updatedUser.birthdate
            });
        } catch (error) {
            next(new APIError("Erreur lors de la modification du profil", 500));
        }
    },

    /**
     * Deletes a user
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
    async deleteProfile (req, res, next) {
        try {
            // deleting a user also deletes the lines associated with this user in the user_card table
            const user = await User.delete(req.user.id);
            // debug(tag);

            if(!user) {
                next(new APIError(`Le profil n'a pas été supprimé.`,400));
            } else {
                res.status(204).json();
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }
    },

    /**
     * Gets all existing users with their role
     * @param {object} _ Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {User[]} an array of User instances
     * @returns {APIError} error
     */
    async getAllUsers (_, res, next) {
        try {
            // here we are not returning the password for security reasons
            const users = await User.findAllWithRole();
            // debug(users);

            res.json(users);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        } 
    },

    /**
     * Updates a specific user's role to the administrator role
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
    async updateUserAsAdmin (req, res, next) {
        try {
            const user = await User.setUserAsAdmin(req.params.id);
 
            if(!user) {
                next(new APIError(`Le profil n'a pas mis à jour.`,400));
            } else {
                res.status(204).json();
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        } 
    }
};   

module.exports = userController;