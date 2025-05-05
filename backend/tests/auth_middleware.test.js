const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
require("dotenv").config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
});
  
afterAll(async () => {
    await mongoose.disconnect();
});

describe("Auth Middleware for JWT Verification", () => {
    describe("JWT Authentication Middleware", () => {
        let user;
        beforeAll(async () => {
            user = await User.create({
                username: "user_jwt_test",
                email: "user_jwt_test@gmail.com",
                password: "password"
            });
        });

        it("should execute the request successfully with a valid JWT", async () => {
            const login = await request(app).post("/api/users/login").send({ email: user.email, password: "password"});

            const response = await request(app).get("/api/endpoints/list").set("Authorization", `Bearer ${login.body.result.accessToken}`);

            expect(response.body.result.error).toBeUndefined();
        });

        it("should throw an error if the JWT is missing", async () => {
            const login = await request(app).post("/api/users/login").send({ email: user.email, password: "password"});

            const response = await request(app).get("/api/endpoints/list");

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");
        });

        it("should throw an error if the JWT is invalid", async () => {
            const login = (await request(app).post("/api/users/login").send({ email: user.email, password: "password"}));

            const response = await request(app).get("/api/endpoints/list").set("Authorization", "Bearer invalid-token");

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");
        });
       
    });
});