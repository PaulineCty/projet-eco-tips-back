const APIError = require("../error/APIError");
const { User, Card, Tag, Achievement } = require("../../models/index");
const { userSchema, userEditionSchema, userEditionPasswordSchema, cardSchema, tagSchema, achievementSchema } = require("./schema");
const bcrypt = require('bcrypt');
const debug = require("debug")("validation");

/**
 * @typedef {import('../services/error/APIError')} APIError;
 */

const validationModule = {
    /**
   * Validates the provided User object in order to create it
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
    async validateUserCreation(req, _, next) {
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

    /**
   * Validates the provided object in order to modify the user's information
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
    async validateUserEdition(req, _, next) {
        const previousUserInfo = await User.findByPk(req.user.id);

        if(previousUserInfo.firstname === req.body.firstname && previousUserInfo.lastname === req.body.lastname && previousUserInfo.email === req.body.email && previousUserInfo.birthday === req.body.birthday ) {
            next(new APIError('Aucune des valeurs n\'a été modifiées.', 400));
        }

        // Checking if the new User email is not already taken since it has to be unique
        try {
            const user = await User.findByEmail(req.body.email);

            if(user && user.email !== previousUserInfo.email) {
                next(new APIError('Cet email est déjà pris.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // The goal here is to send to the front a detailed error
        const { error } = userEditionSchema.validate(req.body);
        if (error) {
            next(new APIError(error.message, 400));
        }
        else {
            next();
        }  
    },

     /**
   * Validates the provided object in order to modify the user's password
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
    async validateUserPasswordEdition(req, _, next) {
        const previousUserInfo = await User.findByPk(req.user.id);

        // Checking if the password has changed
        const hasSamePassword = await bcrypt.compare(req.body.password, previousUserInfo.password);
        if(hasSamePassword) {
            return next(new APIError('Merci de renseigner un mot de passe différent du précédent.', 400));
        }

        // The goal here is to send to the front a detailed error
        const { error } = userEditionPasswordSchema.validate(req.body);
        if (error) {
            return next(new APIError(error.message, 400));
        }
        else {
            next();
        }  
    },

    /**
   * Validates the provided Card object in order to create it
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
    async validateCardCreation(req, _, next) {

        try {
            const card = await Card.findByTitle(req.body.title);
            if(card) {
                next(new APIError('Une carte ayant le même titre existe déjà.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // Not allowing tags to be empty
        if(!req.body.tags.length) {
            next(new APIError('Merci de renseigner au moins une catégorie.', 400));
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

    /**
   * Validates the provided Card object in order to modify it
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
    async validateCardEdition(req, _, next) {
        const previousCard= await Card.findByPkWithTags(req.params.id);
        const differenceInPrevious = previousCard.tags.filter(tag => !req.body.tags.includes(tag));
        const differenceInNew = req.body.tags.filter(tag => !previousCard.tags.includes(tag));

        // If the user is not changing any values then we send an error 400.
        if(!req.body.image && previousCard.title === req.body.title && previousCard.description === req.body.description && previousCard.environmental_rating === req.body.environmentalrating && previousCard.economic_rating === req.body.economicrating && previousCard.value === req.body.value && !differenceInPrevious.length && !differenceInNew.length) {
            next(new APIError('Aucune des valeurs n\'a été modifiées.', 400));
        };

        try {
            const card = await Card.findByTitle(req.body.title);

            if(card && card.title !== previousCard.title) {
                next(new APIError('Une carte ayant le même titre existe déjà.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // Not allowing tags to be empty
        if(!req.body.tags.length) {
            next(new APIError('Merci de renseigner au moins une catégorie.', 400));
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
    
    /**
   * Validates the provided Tag object in order to create it
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
    async validateTagCreation(req, _, next) {

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

     /**
   * Validates the provided Tag object in order to modify it
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
    async validateTagEdition(req, _, next) {
        const previousTag = await Tag.findByPk(req.params.id);

        // If the user is not changing any values then we send a error 400.
        if(previousTag.name === req.body.name && previousTag.color === req.body.color) {
            next(new APIError('Aucune des valeurs n\'a été modifiées.', 400));
        }

        // Checking if the new Tag name is not already taken since it has to be unique
        try {
            const tag = await Tag.findByName(req.body.name);

            if(tag && tag.name !== previousTag.name) {
                next(new APIError('Un tag ayant le même nom existe déjà.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // Checking if the new Tag color is not already taken since it has to be unique
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

    /**
   * Validates the provided Achievement object in order to create it
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
    async validateAchievementCreation(req, _, next) {

        try {
            const achievement = await Achievement.findByTitle(req.body.title);
            if(achievement) {
                next(new APIError('Un accomplissement ayant le même titre existe déjà.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // The goal here is to send to the front a detailed error
        const { error } = achievementSchema.validate(req.body);
        if (error) {
            next(new APIError(error.message, 400));
        }
        else {
            next();
        }  
    },

    /**
   * Validates the provided Achievement object in order to modify it
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
    async validateAchievementEdition(req, _, next) {
        const previousAchievement= await Achievement.findByPk(req.params.id);

        // If the user is not changing any values then we send an error 400.
        if(!req.body.image && previousAchievement.title === req.body.title && previousAchievement.description === req.body.description) {
            next(new APIError('Aucune des valeurs n\'a été modifiées.', 400));
        };

        try {
            const achievement = await Achievement.findByTitle(req.body.title);

            if(achievement && achievement.title !== previousAchievement.title) {
                next(new APIError('Un accomplissement ayant le même titre existe déjà.', 400));
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // The goal here is to send to the front a detailed error
        const { error } = achievementSchema.validate(req.body);
        if (error) {
            next(new APIError(error.message, 400));
        }
        else {
            next();
        }    

    },
};

module.exports = validationModule;

