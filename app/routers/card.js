// const multer = require('multer');
const { cardController } = require("../controllers/index.js");
const debug = require('debug')("router:card");
const authentificationToken = require('../services/authentification/authentificationToken');

const { Router } = require("express");
const cardRouter = Router();

// Configuring the image upload
// const upload = multer({
//     // 5mb maximum
//     limits: {
//         fileSize: 5000000
//     },
//     fileFilter(req, file, callback) {
//         // Only accepting images
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return callback(new APIError('Merci d\'importer un fichier image valide (formats acceptés : .png, .jpeg, .jpg)', 400));
//         }
//         callback(undefined, true);
//     }
// });

// cardRouter.patch("/:id", authentificationToken.isAuthenticated, upload.single('image'), cardController.editCard);

module.exports = cardRouter;