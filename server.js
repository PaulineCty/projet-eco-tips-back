require("dotenv").config();
const cors = require('cors');
const express = require("express");
const path = require("path");
const authentificationTokenMiddleware = require('./app/services/authentification/authentificationToken.js');

const app = express();
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json({
    limit: '10mb'
}));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routing
const { collectionRouter, authentificationRouter, proposalRouter, tagRouter, userRouter, cardRouter, rankingRouter, achievementRouter } = require("./app/routers/index");

/*********************************************/
/*****************  SWAGGER  *****************/
/*********************************************/

// we need to require swagger-ui-express's library
const swaggerUi = require('swagger-ui-express');

// we need fs in order to read swagger.yaml and parse from yaml library to convert the file in js object
const yaml = require('yaml');
const fs = require('fs');

const swaggerDocument = yaml.parse(fs.readFileSync('./swagger.yaml', 'utf8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/*********************************************/
/**************  SWAGGER'S END  **************/
/*********************************************/

app.use(authentificationRouter);
app.use(cardRouter);
app.use(achievementRouter);
app.use("/me/collection", authentificationTokenMiddleware.isAuthenticated, collectionRouter);
// app.use(authentificationTokenMiddleware.isAuthenticated, proposalRouter);
app.use("/tag", authentificationTokenMiddleware.isAuthenticated, tagRouter);
app.use(authentificationTokenMiddleware.isAuthenticated, userRouter);

// Error management
const errorModule = require("./app/services/error/errorHandling");
// 404 error
app.use(errorModule._404);
app.use(errorModule.manage);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});