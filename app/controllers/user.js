const { User } = require("../models/index");
const APIError = require("../services/error/APIError");
const authentificationToken = require('../services/authentification/authentificationToken');

const debug = require('debug')("controller:user");
const bcrypt = require('bcrypt');

const userController = {

    /**
     * Create a new user in the user's table
     * @param {object} req Express's request
     * @param {object} res Express's response
     * @param {function} next - Express.js middleware next function
     * @return {object} return an object with jwt's access token and user's firstname
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
                firstname : newUser.firstname 
            });
        } catch (error) {
            next(new APIError("Erreur lors de l'inscription", 500));
        }
        
    },

    /**
     * Verify a user by his email in the user's table
     * @param {object} req Express's request
     * @param {object} res Express's response
     * @param {function} next - Express.js middleware next function
     * @return {object} return an object with jwt's access token and user's firstname
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
                    firstname : user.firstname
                });
            }

        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

     },

    async getProfile (req, res, next) {
        try {
            const user = await User.findByPkWithRole(req.user.id);
            // debug(user);
            res.json(user);
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }  
    },

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
    }
};   

module.exports = userController;