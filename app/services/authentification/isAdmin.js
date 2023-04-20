const APIError = require("../error/APIError");

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