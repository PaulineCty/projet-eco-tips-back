const APIError = require("../error/APIError");
const { User, Card, Tag } = require("../../models/index");
const { userSchema, cardSchema, tagSchema } = require("./schema");
const debug = require("debug")("validation");

const validationModule = {

    async validateUser(req, res, next) {
        // Testing email uniqueness
        try {
            const user = await User.findByEmail(req.body.email);
            if(user) {
                next(new APIError('Cet email est déjà pris.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // The goal here is to send to the front a detailed error
        const { error } = userSchema.validate(req.body);
        if (error) {
            next(new APIError(error.message, 400));
        }
        else {
            next();
        }  
    },

    async validateCard(req, res, next) {

        try {
            const user = await Card.findByTitle(req.body.title);
            if(user) {
                next(new APIError('Une carte ayant le même titre existe déjà.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // The goal here is to send to the front a detailed error
        const { error } = cardSchema.validate(req.body);
        if (error) {
            next(new APIError(error.message, 400));
        }
        else {
            next();
        }  
    },
    
    async validateNewTag(req, res, next) {

        try {
            const tag = await Tag.findByName(req.body.name);
            if(tag) {
                next(new APIError('Un tag ayant le même nom existe déjà.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        try {
            const tag = await Tag.findByColor(req.body.color);
            if(tag) {
                next(new APIError('Un tag ayant la même couleur existe déjà.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // The goal here is to send to the front a detailed error
        const { error } = tagSchema.validate(req.body);
        if (error) {
            next(new APIError(error.message, 400));
        }
        else {
            next();
        }  
    },

    async validateTagEdition(req, res, next) {

        // The goal here is to send to the front a detailed error
        const { error } = tagSchema.validate(req.body);
        if (error) {
            next(new APIError(error.message, 400));
        }
        else {
            next();
        }  
    }

};

module.exports = validationModule;

