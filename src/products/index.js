import express from "express";
import { ProductModel } from "./model.js";

const productsRouter = express.Router();

productsRouter
  .get("/", async (req, res) => {
    const products = await ProductModel.find({});
    res.send(products);
  })
  .get("/:id", async (req, res) => {
    const product = await ProductModel.findById(req.params.id);

    console.log(product);
    if (!product) {
      res.status(404).send();
    } else {
      res.send(product);
    }
  })
  .post("/", async (req, res) => {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).send(product);
  })
  .put("/:id", async (req, res) => {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      res.status(404).send();
    } else {
      res.send(product);
    }
  })
  .delete("/:id", async (req, res) => {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  });

export default productsRouter;
