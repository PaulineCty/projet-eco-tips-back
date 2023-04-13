require("dotenv").config();
const express = require("express");

// require("dotenv").config();
// const express = require("express");

const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const { collectionRouter } = require("./app/routers/index");

// app.use("/admin" /*,security*/, routerAdmin);
app.use("/collection", collectionRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});