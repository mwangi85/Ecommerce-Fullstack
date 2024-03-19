import createError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import { generateRandomString } from "../utilities/generatePassword.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

const removeCookies = (res, ...cookies) => {
  cookies.forEach((name) => res.clearCookie(name));
};

const createSendToken = (res, status, user) => {
  const jwtToken = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };
  res.cookie("jwtToken", jwtToken, cookieOptions);

  user.password = undefined;

  res.status(status).json({
    success: true,
    status,
    user,
  });
};

const createCart = async (user) => {
  const newCart = await Cart.create({});
  user.cartId = newCart._id;
  await user.save();
};

// signup implementation
// POST: http://localhost:9000/users/signup
// req.body : {firstName: String, lastName: String, email: String, password: String}

export const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    await createCart(user);
    createSendToken(res, 201, user);
  } catch (error) {
    next(error);
  }
};

// forgot password implementation
// POST: http://localhost:3000/users/forgot-password
// req.body : {email: String}

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw createError(400, "User does not exist");
    }
    user.resetPasswordCode = generateRandomString(5);
    await user.save();
    res.send("OK");
  } catch (error) {
    next(error);
  }
};

// forgot password implementation
// POST: http://localhost:3000/users/reset-password
// req.body : {code: String, newPassword: String}

export const resetPassword = async (req, res, next) => {
  try {
    const { code, newPassword, confirmPassword } = req.body;
    if (!code) {
      throw createError(400, "Please enter code");
    }

    if (!newPassword) {
      throw createError(400, "Please enter a new password");
    }
    if (!confirmPassword) {
      throw createError(400, "Please confirm your password");
    }

    if (newPassword !== confirmPassword) {
      throw createError(400, "Passwords do not match");
    }

    const user = await User.findOne({ resetPasswordCode: code });
    if (!user) {
      throw createError(400, "Invalid code");
    }
    user.password = newPassword;
    await user.save();
    res.send({ message: "Your password has been successfully changed" });
  } catch (error) {
    next(error);
  }
};

// login implementation
// POST: http://localhost:9000/users/login
// req.body : {email: String, password: String}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, "Please provide email and password");
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw createError(401, "Incorrect email or password.");
    }

    createSendToken(res, 200, user);
  } catch (error) {
    next(error);
  }
};

// logout implementation
// POST: http://localhost:9000/users/logout
// req.body : {email: String, password: String}

export const logout = (req, res, next) => {
  try {
    removeCookies(res, "jwtToken");

    res.status(200).json({
      success: true,
      status: 200,
      data: "User was successfully logged out.",
    });
  } catch (error) {
    next();
  }
};

export const getCurrentUser = async (req, next) => {
  try {
    const jwtToken = req.cookies["jwtToken"];
    if (!jwtToken) throw createError(401, "Unauthorized request");

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw createError(401, "User is no longer exist.");
    return user;
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req, next);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
