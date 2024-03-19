import { isIdRegistered, isValidId } from "../middlewares/errorHandler.js";
import successHandler from "../middlewares/successHandler.js";
import Cart from "../models/cartModel.js";

// Get cart
//GET: http://localhost:9000/carts/the_id_cart_in_mongoDB

export const getCart = async (req, res, next) => {
  try {
    isValidId(req);
    console.log(req.params);
    const cart = await Cart.findById(req.params.id).populate("items.product");
    //console.log("From get cart", cart)
    successHandler(res, 200, cart);
  } catch (error) {
    next(error);
  }
};

// Add a product to the cart
// POST: http://localhost:9000/carts/the_id_cart_mongoDB
// req.body : {product: "the_id_product_in_mongoDB" }

export const addCartItem = async (req, res, next) => {
  try {
    isValidId(req);
    console.log("add to cart", req.body);
    await isIdRegistered(req, Cart);

    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $push: { items: req.body } },
      { new: true }
    ).populate("items.product");

    successHandler(res, 200, cart);
  } catch (error) {
    next(error);
  }
};

// PATCH: http://localhost:9000/carts/THE_ID_OF_AN_EXISTING_CART_IN_THE_DATABASE
//  req.body : {
//            "product": "THE_ID_OF_A_PRODUCT_IN_THE_CART",
//             "quantity": new-quantity-as-number
//             }

export const updateItemFieldById = async (req, res, next) => {

  
  try {

    const { product, quantity } = req.body;
    console.log( "update product",product)


    isValidId(req);

    const cart = await Cart.findById(req.params.id);

    cart.items.id(req.params.itemId).quantity = req.body.quantity;

    cart.save();

    
    console.log(quantity)


    successHandler(res, 200, cart);
  } catch (error) {
    next(error);
  }
};

export const updateCartItemQuantity = async (cartId, itemId, newQuantity) => {
  try {
    
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { $set: { "items.$[item].quantity": newQuantity } },
      { arrayFilters: [{ "item._id": itemId }], new: true }
    ).populate("items.product");

  
    const updatedItem = cart.items.find((item) => item._id.toString() === itemId);

    return { product: updatedItem.product, quantity: updatedItem.quantity };
  } catch (error) {
    throw error;
  }
};

/* 
 Delete one item from the items array in the cart document

* DELETE: http://localhost:9000/carts/THE_ID_OF_A_CART_IN_MONGODB/THE_ID_ITEM_IN_MONGO
^ req.body : {product: "THE_ID_OF_A_PRODUCT_IN_THE_CART" }
*/

export const deleteCartItem = async (req, res, next) => {
  try {
    isValidId(req);
    const { id, itemId } = req.params;

    const cart = await Cart.findByIdAndUpdate(
      id,
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).populate("items.product");

    successHandler(res, 200, cart);
  } catch (error) {
    next(error);
  }
};
