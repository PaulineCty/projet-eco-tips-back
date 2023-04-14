const APIError = require("../error/APIError");
const Joi = require('joi');

const nameFormat = /^[À-ÿA-Za-z]+$/;
const emailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// 8 characters minimum : 1 digit minimum, 1 special character, 1 uppercase letter minimum and 1 lowercase letter minimum
const passwordFormat = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

// To be confirmed
// const userSchema = Joi.object({
//     firstname: Joi.string().pattern(nameFormat).required().error((errors) => new APIError('Prénom manquant ou caractère(s) non autorisé(s).', 400)),
//     lastname: Joi.string().pattern(nameFormat).required().error((errors) => new APIError('Nom manquant ou caractère(s) non autorisé(s).', 400)),
//     password: Joi.string().pattern(passwordFormat).required().error((errors) => new APIError('Mot de passe manquant ou incorrect (8 caractères minimum comprenant au minimum 1 chiffre, 1 lettre miniscule, 1 lettre majuscule et 1 caractère spécial.', 400)),
//     confirmpassword: Joi.string().pattern(passwordFormat).required().error((errors) => new APIError('Confirmation de mot de passe manquante.', 400)),
//     birthdate: Joi.date().max('now').required().error((errors) => new APIError('Date de naissance manquante ou caractère(s) non autorisé(s).', 400))
// });

const userSchema = Joi.object({
    firstname: Joi.string().pattern(nameFormat).required(),
    lastname: Joi.string().pattern(nameFormat).required(),
    password: Joi.string().pattern(passwordFormat).required(),
    confirmpassword: Joi.ref('password'),
    birthdate: Joi.date().max('now').required()
}).with('password', 'repeat_password');

module.exports = {
    userSchema
};