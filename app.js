import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import usersRouter from "./routes/usersRouter.js";
import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";

import {
  globalErrorHandler,
  routeNotFound,
} from "./middlewares/errorHandler.js";
import { getProductById } from "./controllers/productsController.js";

const app = express();
const { PORT, DB_URI } = process.env;

const corsOptions = {
  origin: ["http://localhost:5173", "https://ecommerce-hautecourture.onrender.com"],
  credentials: true,
};

app
  .use(cors(corsOptions))
  .use(express.json())
  .use(cookieParser())
  .use("/users", usersRouter)
  .use("/products", productsRouter)
  .use("/carts", cartRouter)
  .use(routeNotFound)
  .use(globalErrorHandler)
  .listen(PORT, () => console.log(`Server is running on port ${PORT}`));

mongoose
  .connect(DB_URI)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("error connecting to db ", err));
