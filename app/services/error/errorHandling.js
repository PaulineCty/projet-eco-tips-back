const APIError = require("./APIError");
const debug = require("debug")("error");

const errorModule = {
    /**
     * Manages the errors
     * @param {*} err Express' error
     * @param {object} _ Express' request
     * @param {object} res Express' response
     * @param {function} __ Express' function executing the succeeding middleware
     */
    async manage(err, _, res, __) {
        debug(err);
        return res.status(err.code).json({ message : err.message});
    },

    /**
     * Manages the 404 error
     * @param {object} _ Express' request
     * @param {object} __ Express' response
     * @param {function} next Express' function executing the succeeding middleware
     */
    _404(_, __, next) {
        next(new APIError('Page introuvable', 404));
    }
};

module.exports = errorModule;