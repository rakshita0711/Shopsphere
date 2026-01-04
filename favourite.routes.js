import express from "express";
import {
  getUserFavourites,
  addFavourite,
  removeFavourite,
} from "../controllers/favourite.controller.js";

const router = express.Router();

/* GET */
router.get("/:userId", getUserFavourites);

/* POST */
router.post("/", addFavourite);

/* DELETE */
router.delete("/:productId/:userId", removeFavourite);

export default router;
