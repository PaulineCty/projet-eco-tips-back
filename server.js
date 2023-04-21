require("dotenv").config();
const cors = require('cors');
const express = require("express");
const path = require("path");
const authentificationTokenMiddleware = require('./app/services/authentification/authentificationToken.js');
const adminMiddleware = require('./app/services/authentification/isAdmin.js');

const app = express();
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json({
    limit: '10mb'
}));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const { collectionRouter, authentificationRouter, proposalRouter, tagRouter, userRouter, cardRouter } = require("./app/routers/index");

app.use(authentificationRouter);

app.use("/me/collection", authentificationTokenMiddleware.isAuthenticated, collectionRouter);

app.use(authentificationTokenMiddleware.isAuthenticated, proposalRouter);

app.use("/tag", authentificationTokenMiddleware.isAuthenticated, tagRouter);

app.use(authentificationTokenMiddleware.isAuthenticated, userRouter);

app.use(authentificationTokenMiddleware.isAuthenticated, cardRouter);

// error management
const errorModule = require("./app/services/error/errorHandling");
// 404 error
app.use(errorModule._404);
// overall error management
app.use(errorModule.manage);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});