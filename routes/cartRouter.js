import express from "express";

import {
  getCart,
  addCartItem,
  deleteCartItem,

  updateItemFieldById

} from "../controllers/cartController.js";

const router = express.Router();



router
  .route("/:id")
  .get(getCart)
  .post(addCartItem);


router.route("/:id/:itemId").patch(updateItemFieldById).delete(deleteCartItem);



export default router;