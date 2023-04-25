/**
 * An APIError is an object extending the default Error class including a message and a code
 * @typedef {Object} APIError
 * @property {string} message - error message
 * @property {integer} code - error code
 */
class APIError extends Error {
    constructor(message,code){
        super(message);
        this.code = code;
    }
};

module.exports = APIError;