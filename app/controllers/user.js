const { User } = require("../models/index");
const APIError = require("../services/error/APIError");
const authentificationToken = require('../services/authentification/authentificationToken');

const debug = require('debug')("controller:user");
const jwt = require('jsonwebtoken');
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
     * @returns {void} - No Content (HTTP 200) response
     * @returns {APIError} error
     */
    async signUp(req,res,next) {
        const {firstname, lastname, email, password, birthdate} = req.body;

        // Password encrypting
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating the new user in the user table, only standard users can be created this way (no admin)
        try {
            await User.create({firstname, lastname, email, password: hashedPassword, birthdate});
            res.status(200).json();
        } catch (error) {
            return next(new APIError("Erreur lors de l'inscription", 500));
        }
        
    },

    /**
     * Verifies a user's connexion form using their email and password
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {object} return an object with jwt's access token, user's firstname, role_id, ecocoins and score
     * @returns {APIError} error
     */
    async signIn (req,res,next) {
        const { email, password } = req.body;
        
        try {
            // Checking if an account exists with this email
            const user = await User.findByEmail(email);
            if(!user) {
                return next(new APIError('Couple login/mot de passe est incorrect.', 401));
            }
            // Checking if the password is matching
            const hasMatchingPassword = await bcrypt.compare(password, user.password);
            if(!hasMatchingPassword) {
                return next(new APIError('Couple login/mot de passe est incorrect.', 401));
            }

            // Generating a token and redirecting to the home page
            const accessToken = authentificationToken.generateAccessToken(user);
            const refreshToken = authentificationToken.generateRefreshToken(user);

            res.json({ 
                accessToken,
                refreshToken, 
                firstname : user.firstname,
                role_id : user.role_id,
                score : user.score,
                ecocoins : user.ecocoins
            });
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
        }

     },

     /**
     * Sends out a new token when the initial one has expired
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {object} return an object with a jwt's access token
     * @returns {APIError} error
     */
    async refreshAccess (req, res, next) {
        const authHeader = req.headers.authorization;
        //authHeader's authorization format is "Bearer token" hence the .split(' ')[1]
        const token = authHeader && authHeader.split(' ')[1];
   
        if (!token) return next(new APIError('Veuillez vous authentifier pour accéder à cette page.', 401));
        
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return next(new APIError("Vous n'êtes pas autorisé à accéder à cette page.", 401));
            } 
            // Checking if the user still exists
            const userCheck = await User.findByEmail(user.email);
            
            if(!userCheck) {
                return next(new APIError("Vous n'êtes pas autorisé à accéder à cette page.", 401));
            } 

            delete user.iat;
            delete user.exp;

            const refreshedToken = authentificationToken.generateAccessToken(user);
            res.json({
                accessToken: refreshedToken,
            });
        });
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
            const user = await User.findByPkWoPassword(req.user.id);

            //converting the birthdate
            user.birthdate = new Intl.DateTimeFormat('default', { timeZoneName: 'short'}).format(new Date(user.birthdate));

            res.json(user);
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
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
        const {firstname, lastname, email, birthdate} = req.body;

        try {
            const updatedUser = await User.update({id: req.user.id},{firstname, lastname, email, birthdate : new Date(birthdate)});

            //converting the birthdate
            const birthdateWithOffset = new Intl.DateTimeFormat('default', { timeZoneName: 'short'}).format(new Date(updatedUser.birthdate));

            res.json({ 
                firstname : updatedUser.firstname,
                lastname : updatedUser.lastname,
                email : updatedUser.email,
                birthdate : birthdateWithOffset
            });
        } catch (error) {
            return next(new APIError("Erreur lors de la modification du profil", 500));
        }
    },

    /**
     * Updates a user's password
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {void} - No Content (HTTP 204) response
     * @returns {APIError} error
     */
    async updatePassword (req, res, next) {

        // Password encrypting
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        try {
            await User.update({id: req.user.id},{password: hashedPassword});

            res.status(204).json();
        } catch (error) {
            return next(new APIError("Erreur lors de la modification du mot de passe", 500));
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

            if(!user) {
                return next(new APIError(`Le profil n'a pas été supprimé.`,400));
            } else {
                res.status(204).json();
            }
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
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

            res.json(users);
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
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
                return next(new APIError(`Le profil n'a pas mis à jour.`,400));
            } else {
                res.status(204).json();
            }
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
        } 
    },

    /**
     * Gets the 5 best user's ordered by score
     * @param {object} _ Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {User[]} an array of User instances
     * @returns {APIError} error
     */
    async getUserByScore (req, res, next) {
        try {
            const users = await User.getUsersByScore();

            res.json(users);
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
        } 
    },

    /**
     * Gets the top 5 users with the highest card creation amount
     * @param {object} _ Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {User[]} an array of User instances
     * @returns {APIError} error
     */
    async getUserByCardCreation (req, res, next) {
        try {
            const users = await User.getUsersByProposedCards();

            res.json(users);
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
        }
    }
};   

module.exports = userController;