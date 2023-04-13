import { cardController } from "../controllers/index.js";
import Debug from 'debug';
const debug = Debug("router:collection");
import { Router } from "express";

const collectionRouter = Router();

collectionRouter.get("/:id(\\d+)", cardController.getByUser);

export { collectionRouter };