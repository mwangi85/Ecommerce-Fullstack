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
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const { PORT, DB_URI } = process.env;
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

const corsOptions = {
  origin: ["http://localhost:5173", "https://ecommerce-hautecourture.onrender.com","https://ecommerce-fullstack-luf0.onrender.com"],
  credentials: true,
};

app
  .use(cors(corsOptions))
  .use(express.json())
  .use(express.static(path.join(__dirName, "/dist")))
  .use(cookieParser())
  .use("/users", usersRouter)
  .use("/products", productsRouter)
  .use("/carts", cartRouter)
  .get("/*", (req, res, next) => {
    res.sendFile(path.join(__dirName, "/dist", "index.html"));
  })
  .use(routeNotFound)
  .use(globalErrorHandler)
  .listen(PORT, () => console.log(`Server is running on port ${PORT}`));

mongoose
  .connect(DB_URI)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("error connecting to db ", err));
