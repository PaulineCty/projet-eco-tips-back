const { User } = require("../models/index");
const APIError = require("../services/error/APIError");
const authentificationToken = require('../services/authentification/authentificationToken');

const debug = require('debug')("controller:user");
const bcrypt = require('bcrypt');

const userAuthController = {

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

    async signIn (req,res,next) {
        const { email, password } = req.body;
        
        // Checking if an account exists with this email
        let user;
        try {
            user = await User.findByEmail(email);
            if(!user) {
                next(new APIError('Couple login/mot de passe est incorrect.', 401));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

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

};   

module.exports = userAuthController;