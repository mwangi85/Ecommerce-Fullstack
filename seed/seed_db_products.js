import mongoose from "mongoose";
import data from "./products.js";
import Product from "../models/productModel.js";
import "dotenv/config";

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    const products = data.map((item) => new Product(item));

    await Product.deleteMany();
    console.log("Data Deleted successfully");

    await Product.insertMany(products);
    console.log("Data seeded successfully");
  } catch (error) {
    console.log(`Error while seeding data: ${error}`);
  } finally {
    mongoose.connection.close();
  }
})();