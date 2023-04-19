const Joi = require('joi');

const nameFormat = /^[À-ÿA-Za-z -]+$/;
const emailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// 8 characters minimum : 1 digit, 1 special character, 1 uppercase letter and 1 lowercase letter minimum
const passwordFormat = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
// hexadecimal code
const colorFormat = /^#[a-fA-F0-9]{6}$/;

const userSchema = Joi.object({
    firstname: Joi.string().pattern(nameFormat).required().messages({
        'string.pattern.base': `Caractère(s) non autorisé(s) dans le champ 'Prénom'.`,
        'string.empty': `Le champ 'Prénom' ne peut pas être vide.`,
        'any.required': `Le champ 'Prénom' est manquant.`
      }),
    lastname: Joi.string().pattern(nameFormat).required().messages({
        'string.pattern.base': `Caractère(s) non autorisé(s) dans le champ 'Nom'.`,
        'string.empty': `Le champ 'Nom' ne peut pas être vide.`,
        'any.required': `Le champ 'Nom' est manquant.`
      }),
    email: Joi.string().pattern(emailFormat).required().messages({
        'string.pattern.base': `Caractère(s) non autorisé(s) dans le champ 'Email' ou format non valide.`,
        'string.empty': `Le champ 'Email' ne peut pas être vide.`,
        'any.required': `Le champ 'Email' est manquant.`
      }),
    password: Joi.string().pattern(passwordFormat).required().messages({
        'string.pattern.base': `Format du mot de passe incorrect : 8 caractères minimum comprenant au minimum 1 chiffre, 1 lettre miniscule, 1 lettre majuscule et 1 caractère spécial.'.`,
        'string.empty': `Le champ 'Mot de passe' ne peut pas être vide.`,
        'any.required': `Le champ 'Mot de passe' est manquant.`
      }),
    confirmpassword: Joi.string().required().valid(Joi.ref('password')).messages({'any.only': `Les deux mots de passe doivent être identiques.`}),
    birthdate: Joi.date().max('now').required().messages({
        'date.base' : `'Date de naissance' doit être une date.`,
        'date.format': `Format du champ 'Date de naissance' incorrect.`,
        'any.empty': `Le champ 'Date de naissance' ne peut pas être vide.`,
        'any.required': `Le champ 'Date de naissance' est manquant.`
      })
});

const cardSchema = Joi.object({
  image: Joi.string().messages({ // TEMPORARY ! While working on image imports
      'string.empty': `Image manquante.`,
      'any.required': `Image manquante.`
    }),
  title: Joi.string().required().messages({
      'string.base' : `'Titre' doit être une chaîne de caractère.`,
      'string.empty': `Le champ 'Titre' ne peut pas être vide.`,
      'any.required': `Le champ 'Titre' est manquant.`
    }),
  description: Joi.string().required().messages({
      'string.base' : `'Description' doit être une chaîne de caractère.`,
      'string.empty': `Le champ 'Description' ne peut pas être vide.`,
      'any.required': `Le champ 'Description' est manquant.`
    }),
  environmental_rating: Joi.number().min(0).max(5).required().messages({
      'number.base' : `'Note environnementale' doit être un nombre.`,
      'any.empty': `Le champ 'Note environnementale' ne peut pas être vide.`,
      'any.required': `Le champ 'Note environnementale' est manquant.`
    }),
  economic_rating: Joi.number().min(0).max(5).required().messages({
    'number.base' : `'Note économique' doit être un nombre.`,
    'any.empty': `Le champ 'Note économique' ne peut pas être vide.`,
    'any.required': `Le champ 'Note économique' est manquant.`
  }),
  value: Joi.number().integer().required().messages({
      'number.base' : `'Valeur' doit être un nombre entier.`,
      'any.empty': `Le champ 'Valeur' ne peut pas être vide.`,
      'any.required': `Le champ 'Valeur' est manquant.`
    }),
  tags : Joi.array().items(Joi.number().integer()).required().messages({
    'array.base' : `'Tags' doit être un tableau.`,
    'any.empty': `Le champ 'Tags' ne peut pas être vide.`,
    'any.required': `Le champ 'Tags' est manquant.`
  })
});

const tagSchema = Joi.object({
  name: Joi.string().pattern(nameFormat).required().messages({ // TEMPORARY ! While working on image imports
      'string.pattern.base' : `Caractère(s) non autorisé(s) dans le champ 'Nom'`,
      'string.empty': `Le champ 'Nom' ne peut pas être vide.`,
      'any.required': `Le champ 'Nom' est manquant.`
    }),
  color: Joi.string().pattern(colorFormat).required().messages({
      'string.pattern.base' : `Caractère(s) non autorisé(s) dans le champ 'Couleur', code hexadécimal attendu.`,
      'string.empty': `Le champ 'Couleur' ne peut pas être vide.`,
      'any.required': `Le champ 'Couleur' est manquant.`
    }),
});

module.exports = {
    userSchema,
    cardSchema,
    tagSchema
};