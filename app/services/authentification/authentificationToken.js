const APIError = require("../error/APIError");
const jwt = require('jsonwebtoken');

/**
 * @typedef {import('../../models/index').User} User;
 * @typedef {import('../../services/error/APIError')} APIError;
 */

const authentificationToken = {
  /**
   * Creates a JWT access token
   * @param {User} user.body.required - User Object
   * @returns {string} JWT access token
   */
  generateAccessToken(user) {
    // expires in 30 minutes
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
  },

    /**
   * Creates a JWT access token
   * @param {User} user.body.required - User Object
   * @returns {string} JWT access token
   */
    generateRefreshToken(user) {
      // expires in 30 minutes
      return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
    },

  /**
   * Middleware allowing only logged users to continue
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
  isAuthenticated(req, _, next) {
    const authHeader = req.headers.authorization;
    //authHeader's authorization format is "Bearer token" hence the .split(' ')[1]
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return next(new APIError('Veuillez vous authentifier pour accéder à cette page.', 401));

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        next(new APIError("Vous n'êtes pas autorisé à accéder à cette page.", 401));
      }
      req.user = user;
      next();
    });
  }

}

module.exports = authentificationToken;

