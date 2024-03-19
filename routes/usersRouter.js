import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  getMe,
} from "../controllers/authController.js";

import {
  getAllUsers,
  getUserById,
  deleteUserById,
} from "../controllers/usersController.js";

import validateSanitize from "../middlewares/validateAndSanitize.js";
import validateSanitizePasswordReset from "../middlewares/validateAndSanitizePasswordReset.js";

const router = express.Router();

router.post("/signup", validateSanitize, register);
router.post("/login", validateSanitize, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", validateSanitizePasswordReset, resetPassword);
router.get("/logout", logout);

router.get("/me", getMe);

router.route("/:id").get(getUserById).delete(deleteUserById);
router.route("/").get(getAllUsers);

export default router;
