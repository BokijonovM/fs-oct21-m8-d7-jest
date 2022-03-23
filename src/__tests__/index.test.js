import { app } from "../app.js";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const request = supertest(app);

describe("Testing the app endpoints", () => {
  beforeAll((done) => {
    console.log("This gets run before all tests in this suite");

    mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("Connected to the test database");
      done();
    });
  });

  it("should check that the GET /test endpoint returns a success message", async () => {
    const response = await request.get("/test");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Test success");
  });

  const validProduct = {
    name: "Test Product",
    price: 200,
  };

  let _id = null;

  it("should check that the POST /products endpoint creates a new product", async () => {
    const response = await request.post("/products").send(validProduct);

    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBeDefined();
    expect(response.body.price).toBeDefined();

    _id = response.body._id;
  });

  it("should check that the GET /products endpoint returns a list of products", async () => {
    const response = await request.get("/products");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should check that the GET /products/:id returns a valid product with a valid id", async () => {
    const response = await request.get(`/products/${_id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(_id);
    expect(response.body.name).toBe(validProduct.name);
    expect(response.body.price).toBe(validProduct.price);
  });

  it("should check that the GET /products/:id returns a 404 without a valid id", async () => {
    const response = await request.get(`/products/999999999999999999999999`);

    expect(response.status).toBe(404);
  });

  const validUpdate = {
    name: "Test Product Updated",
  };

  it("should check that a valid PUT /products/:id update request gets executed correctly", async () => {
    const response = await request.put(`/products/${_id}`).send(validUpdate);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(validUpdate.name);
    expect(typeof response.body.name).toBe("string");
  });

  it("should check that a valid PUT /products/:id update request gets 404 on an invalid ID", async () => {
    const response = await request
      .put(`/products/444444444444444444444444`)
      .send(validUpdate);

    expect(response.status).toBe(404);
  });

  it("should check that the DELETE /products/:id returns a valid product with a valid id", async () => {
    const response = await request.delete(`/products/${_id}`);
    expect(response.status).toBe(204);

    const deleteProductResponse = await request.get(`/products/${_id}`);
    expect(deleteProductResponse.status).toBe(404);
  });

  it("should check that the DELETE /products/:id returns a 404 without a valid id", async () => {
    const response = await request.delete(`/products/999999999999999999999999`);

    expect(response.status).toBe(404);
  });

  afterAll((done) => {
    mongoose.connection
      .dropDatabase()
      .then(() => {
        return mongoose.connection.close();
      })
      .then(() => {
        done();
      });
  });

  // it("should test that the GET /products endpoint returns a list of products", async () => {})
});
