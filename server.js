require("dotenv").config();
const cors = require('cors');
const express = require("express");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const { collectionRouter, authentificationRouter, proposalRouter, tagRouter, profileRouter, cardRouter } = require("./app/routers/index");

// app.use("/admin" /*,security*/, routerAdmin);
app.use(authentificationRouter);
app.use("/me/collection", collectionRouter);
app.use("/me/proposal", proposalRouter);
app.use("/tag", tagRouter);
app.use("/me/profile", profileRouter);
app.use("/card", cardRouter);

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