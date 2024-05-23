import mongoose from "mongoose";
import request from "supertest";

import app from "../../app.js";

import { findUser, deleteAllUsers } from "../../services/authServices.js";

const { DB_TEST_HOST, PORT = 3000 } = process.env;

describe("test /api/users/login", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await deleteAllUsers();
  });

  it("test login with correct data", async () => {
    const userData = {
      email: "victor@gmail.com",
      password: "123456",
    };

    request(app).post("/api/users/register").send(userData);

    const { statusCode, body } = request(app)
      .post("/api/users/login")
      .send(userData);

    expect(statusCode).toBe(200);
    expect(body.email).toBe(userData.email);
    expect(body.password).toBe(userData.password);

    const user = await findUser({ email: userData.email });
    expect(user).not.toBeNull();
    expect(user.email).toBe(userData.email);
    expect(user.subscription).toBe("starter");
    expect(user.token).not.toBeNull();
  });
});
