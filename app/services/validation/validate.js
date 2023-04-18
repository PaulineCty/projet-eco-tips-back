const APIError = require("../error/APIError");
const { User, Card } = require("../../models/index");
const { userSchema, cardSchema } = require("./schema");
const debug = require("debug")("validation");

const validationModule = {

    async validateUser(req, res, next) {
        // Testing email uniqueness
        try {
            const user = await User.findByEmail(req.body.email);
            if(user) {
                next(new APIError('Cet email est déjà pris.', 500));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // The goal here is to send to the front a detailed error
        const { error } = userSchema.validate(req.body);
        if (error) {
            next(new APIError(error.message, 500));
        }
        else {
            next();
        }  
    },

    async validateCard(req, res, next) {

        try {
            const user = await Card.findByTitle(req.body.title);
            if(user) {
                next(new APIError('Une carte ayant le même titre existe déjà.', 500));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // The goal here is to send to the front a detailed error
        const { error } = cardSchema.validate(req.body);
        if (error) {
            next(new APIError(error.message, 500));
        }
        else {
            next();
        }  
    }  

};

module.exports = validationModule;

