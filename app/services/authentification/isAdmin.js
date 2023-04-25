const APIError = require("../error/APIError");

/**
 * @typedef {import('../../models/index').User} User;
 */

/**
   * Middleware allowing only admin users to continue
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
function isAdmin(req, _ , next) {
    // the role_id 1 is corresponding to the admin role
    if (req.user.role_id == 1) {
        next();
    }
    else {  
        next(new APIError("Vous n'êtes pas autorisé à accéder à cette page.", 401));
    }
};


module.exports = isAdmin;