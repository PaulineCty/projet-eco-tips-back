const APIError = require("../error/APIError");
const { User } = require("../../models/index");
const { userSchema } = require("./schema");
const debug = require("debug")("validation");

const validationModule = {

    async validateUser(req, res, next) {
        // Testing email uniqueness
        try {
            const user = await User.findByEmail(req.body.email);
            if(user) {
                return res.status(400).json({ errorMessage : 'Cet email est déjà pris.'});
            }
        } catch (error) {
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // The goal here is to send to the front a more detailed error
        const { error } = userSchema.validate(req.body);
        console.log(error);
        if (error) {
            return res.status(500).json('Erreur de saisie utilisateur.')
        }
        else {
            next();
        }  
    } 

};

// const { error, value } = userSchema.validate(req.body);

//   if (error) {
//     return res.status(error.status).json({
//       message: error.message
//     });

module.exports = validationModule;

