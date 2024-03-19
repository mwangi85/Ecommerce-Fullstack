import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: String,
    season: String,
    description: String,
    img: String,
    price: Number,
    gender: String,
    category: String,
    sizes: [Number],
    rating: {
        rating: Number,
        count: Number
    }    
});

export default model("Product", productSchema);