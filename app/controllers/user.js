const { User } = require("../models/index");
const APIError = require("../services/error/APIError");

const debug = require('debug')("controller:user");
const bcrypt = require('bcrypt');

const userAuthController = {

    async signUp(req,res,next) {
        const {firstname, lastname, email, password, confirmation, birthdate} = req.body;

        //Testing user input 
        if(!firstname || !lastname || !email || !password || password !== confirmation || !birthdate) {
            return res.status(400).json({ errorMessage : 'Erreur dans la saisie du formulaire'});
        }
        
        //Testing email uniqueness
        const user = await User.findByEmail(email);
        debug(user);
        if(user) {
            return res.status(400).json({ errorMessage : 'Cet email est déjà pris.'});
        }
        
        // Validating password format
        // if(!schema.validate(password)) {
        //     return res.render('signup', { errorMessage : 'Politique de mot de passe incorrect'});
        // }

        //Password encrypting
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Creating the new user in the user table, only standard can be created this way (no admin)
        try {
            const newUser = await User.create({firstname, lastname, email, password: hashedPassword, birthdate, role_id : 1});
            debug(newUser);
            res.redirect(`/profile/${newUser.id}`); 
        } catch (error) {
            next(new APIError("Erreur lors de l'inscription", 500));
        }
    },

    async signIn (req,res,next) {
        const { email, password, confirmation } = req.body;

        //Testing user input 
        if(password !== confirmation) {
            return res.json({ errorMessage : 'Erreur dans la saisie du formulaire'});
        }
        
        //Checking if an account exists with this email
        try {
            const user = await User.findByEmail(email);
            if(!user) {
                return res.status(400).json({ errorMessage : 'Couple login/mot de passe est incorrect.'});
            }
        } catch (error) {
            next(new APIError("Erreur interne",500));
        }

        //Checking if the password is matching
        const hasMatchingPassword = await bcrypt.compare(password, user.password);
        if(!hasMatchingPassword) {
            return res.status(400).json({ errorMessage : 'Couple login/mot de passe est incorrect.'});
        }
        
        if(newUser) {
            // req.session.user = user;
            res.redirect('/'); 
        } else {
            next(new APIError("Erreur lors l'authentification", 500));
        }
     },

     signOut(req,res) {
        // req.session.user = null;
        res.redirect('/');
     }
};
    

module.exports = userAuthController;