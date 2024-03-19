import User from "../models/userModel.js";
import successHandler from "../middlewares/successHandler.js";
import { isValidId } from "../middlewares/errorHandler.js";

// Get all users
//  GET: http://localhost:9000/users



export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    successHandler(res, 200, users);
  } catch (error) {
    next(error);
  }
};

// Get one user
//  GET: http://localhost:9000/users/ID_USER_IN_MONGODB

export const getUserById = async (req, res, next) => {
  try {
    isValidId(req);
    const user = await User.findById(req.params.id);
    successHandler(res, 200, user);
  } catch (error) {
    next(error);
  }
};

/* 
 Delete one user from the database

* DELETE: http://localhost:8000/users/THE_ID_OF_A_USER_IN_MONGODB
^ 
*/

export const deleteUserById = async (req, res, next) => {
  try {
    isValidId(req);
    const user = await User.findByIdAndDelete(req.params.id);
    successHandler(res, 200, user);
  } catch (error) {
    next(error);
  }
};
