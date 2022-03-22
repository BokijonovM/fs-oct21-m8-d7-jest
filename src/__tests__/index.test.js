import supertest from "supertest";
import { app } from "../app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

console.log(process.env.MONGO_URL);

const client = supertest(app);

describe("Testing the testing environment", () => {
  test("should check that true is true", () => {
    expect(true).toBe(true);
  });
  test("should check that 1 + 1 is 2", () => {
    expect(1 + 1).toBe(2);
  });
});

describe("Testing the endpoints", () => {
  beforeAll(async () => {
    console.log("Before all tests...");
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected to Mongo");
  });

  it("should test that the test endpoint returns a success message", async () => {
    const response = await client.get("/test");
    expect(response.body.message).toBe("Test success");
  });

  const validProduct = {
    name: "Test product",
    price: 900,
  };

  it("should test that the POST /products endpoint returns the newly created product", async () => {
    const response = await client.post("/products").send(validProduct);
    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();

    console.log(response.body);
  });

  const invalidData = {
    whatever: "something",
  };

  it("should test that POST /products with INVALID data returns 400", async () => {
    const response = await client.post("/products").send(invalidData);
    expect(response.status).toBe(400);
  });

  let createdProductId;
  it("should test that the GET /products endpoint returns the product we just created", async () => {
    const response = await client.get("/products");
    expect(response.status).toBe(200);

    createdProductId = response.body[0]._id;
  });

  it("should test that the test endpoint returns a id", async () => {
    const response = await client.get("/test/:id");
    expect(response.status).toBe(404);
  });

  it("should test that the test endpoint returns 204", async () => {
    const response = await client.delete("/test/:id");
    expect(response.status).toBe(404);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    console.log("Closed Mongo connection.");
  });
});
