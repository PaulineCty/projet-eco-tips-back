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
        // if(!err.message) {
        //     switch (err.code) {
        //         case 400:
        //             res.status(400).json({ message : "Bad request" });
        //             break;
        //         case 404:
        //             res.status(404).json({ message : "Not found" });
        //             break;
        //         case 401:
        //             res.status(401).json({ message : "Unauthorized" });
        //             break;
        //         case 500:
        //             res.status(500).json({ message : "Internal Server Error" });
        //             break;
        //         default:
        //             res.status(err.code).json({ message : "Internal server error" });
        //             break;
        //     }
        // } else {
            res.status(err.code).json({ message : err.message });
        // }
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