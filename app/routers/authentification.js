const { userAuthController } = require("../controllers/index.js");
const debug = require('debug')("router:authentification");

const { Router } = require("express");
const authentificationRouter = Router();

authentificationRouter.post("/sign-in", userAuthController.signIn);

authentificationRouter.post("/sign-up", userAuthController.signUp);

authentificationRouter.get('/sign-out', userAuthController.signOut);

module.exports = authentificationRouter;