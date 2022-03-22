import express from "express";
import Product from "./model.js";
const productsRouter = express.Router();

productsRouter
  .get("/", async (req, res) => {
    const products = await Product.find({});
    res.status(200).send(products);
  })
  .get("/:id", async (req, res, next) => {
    try {
      const proId = req.params.id;

      const product = await Product.findById(proId);
      if (product) {
        res.send(product);
      } else {
        res.status(404).send(`Product with id ${proId} not found!`);
      }
    } catch (error) {
      next(error);
    }
  })
  .post("/", async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .delete("/:id", async (req, res, next) => {
    try {
      const accId = req.params.id;
      const deletedAcc = await Product.findByIdAndDelete(accId);
      if (deletedAcc) {
        res.status(204).send(`Product with id ${accId} deleted!`);
      } else {
        res.status(404).send(`Product with id ${accId} not found!`);
      }
    } catch (error) {
      next(error);
    }
  });

export default productsRouter;
