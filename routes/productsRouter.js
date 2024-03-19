import express from "express";

import {
    getAllProducts,
    getProductById,
   
} from "../controllers/productsController.js";

const router = express.Router();

router.route("/:id").get(getProductById);

router.route("/").get(getAllProducts);

export default router;
