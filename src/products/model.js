import { ProductSchema } from "./schema.js";
import mongoose from "mongoose";

export const ProductModel = new mongoose.model("products", ProductSchema);
