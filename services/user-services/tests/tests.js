import request from "supertest";
import { connectClient, closeClient } from "../src/models/userModel";
import express from "express";
import userRoutes from "../src/routes/userRoutes"

const app = express()

app.use('/api/users/', userRoutes);

beforeAll(async () => {
  await connectClient();
});

afterAll(async () => {
  await closeClient();
});

describe("User routes", () => {
  let userId;

  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "testpassword",
  };

  it("should create a new user", async () => {
    const response = await request(app).post("/api/users").send(testUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "User created successfully");
    expect(response.body).toHaveProperty("userId");
    userId = response.body.userId;
  });

  it("should get all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should update a user", async () => {
    const updatedUser = {
      name: "Updated Test User",
      email: "updated@example.com",
      password: "updatedpassword",
    };

    const response = await request(app).put(`/api/users/${userId}`).send(updatedUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "User updated successfully");
    expect(response.body).toHaveProperty("userId", userId.toString());
  });

  it("should delete a user", async () => {
    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "User deleted successfully");
  });

  it("should not find a deleted user", async () => {
    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});
