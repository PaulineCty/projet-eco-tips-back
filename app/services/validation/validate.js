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
        const previousTag = await Tag.findByPk(req.params.id);

        // If the user is not changing any values then we send a error 400.
        if(previousTag.name === req.body.name && previousTag.color === req.body.color) {
            next(new APIError('Aucune des valeurs n\'a été modifiées.', 400));
        }

        try {
            const tag = await Tag.findByName(req.body.name);

            if(tag && tag.name !== previousTag.name) {
                next(new APIError('Un tag ayant le même nom existe déjà.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        try {
            const tag = await Tag.findByColor(req.body.color);

            if(tag && tag.color !== previousTag.color) {
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

    async validateCardEdition(req, res, next) {
        // const previousCard= await Card.findByPk(req.params.id);

        // // If the user is not changing any values then we send a error 400.
        // if(previousCard.title === req.body.title) {
        //     next(new APIError('Aucune des valeurs n\'a été modifiées.', 400)); // Si on change autre chose que le titre
        // };

        try {
            const card = await Card.findByTitle(req.body.title); // voir le findbytitle qui prend id en param (title à la place plus logique)

            if(card /*&& card.title !== previousCard.title*/) {
                next(new APIError('Une carte ayant le même titre existe déjà.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

    }
};

module.exports = validationModule;

