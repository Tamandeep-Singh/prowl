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

describe("Users API Route and Controller", () => {
    describe("/api/users/register", () => {

        it("should register a user successfully", async () => {
            const response = await request(app).post("/api/users/register").send({user: {username: "user_reg_test", password:"password", email: "user_reg_test@gmail.com"}});

            expect(response.status).toBe(200);
            expect(response.body.result.success).toBeTruthy();
            expect(response.body.result).toHaveProperty("accessToken");
            expect(response.body.result).toHaveProperty("refreshToken");
        });

        it("should not allow missing fields", async () => {
            const response = await request(app).post("/api/users/register").send({user: {password:"password", email: "user_reg_testing@gmail.com"}});

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");
        });
    });

    describe("/api/users/login", () => {
        let user;
        beforeAll(async () => {
            user = await User.create({
                username: "user_login_test",
                email: "user_login_test@gmail.com",
                password: "password"
            });
        });

        it("should authenticate the user successfully", async () => {
            const response = await request(app).post("/api/users/login").send({email: user.email,  password: "password"});

            expect(response.status).toBe(200);
            expect(response.body.result.success).toBeTruthy();
            expect(response.body.result).toHaveProperty("accessToken");
            expect(response.body.result).toHaveProperty("refreshToken");
        });

        it("should not authenticate when provided with an incorrect password", async () => {
            const response = await request(app).post("/api/users/login").send({email: user.email,  password:"incorrect"});

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");
        });

        it("should throw an error when provided with a non-existent user", async () => {
            const response = await request(app).post("/api/users/login").send({email: "does_not_exist@gmail.com",  password:"password"});

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");
        });
    });

    describe("/api/users/refresh/token", () => {
        let user;
        beforeAll(async () => {
            user = await User.create({
                username: "user_refresh_test",
                email: "user_refresh_test@gmail.com",
                password: "password"
            });
        });

        it("should issue new JWT access and refresh tokens", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email,  password:"password"});

            const response = await request(app).post("/api/users/refresh/token").send({refreshToken: login.body.result.refreshToken});

            expect(response.status).toBe(200);
            expect(response.body.result.success).toBeTruthy();
            expect(response.body.result).toHaveProperty("accessToken");
            expect(response.body.result).toHaveProperty("refreshToken");
        });

        it("should throw an error when no refresh token is provided", async () => {
            const response = await request(app).post("/api/users/refresh/token").send({refreshToken: null});

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");
        });
    });

    describe("/api/users/list", () => {
        let admin;
        let user;
        beforeAll(async () => {
            admin = await User.create({
                username: "admin_list_test",
                email: "admin_list_test@gmail.com",
                password: "password",
                role: "administrator"
            });

            user = await User.create({
                username: "user_list_test",
                email: "user_list_test@gmail.com",
                password: "password"
            });
        });

        it("should list all users in the database if the user has the administrator role", async () => {
            const login = await request(app).post("/api/users/login").send({email: admin.email, password: "password"});

            const response = await request(app).get("/api/users/list").set("Authorization", `Bearer ${login.body.result.accessToken}`); 

            expect(response.status).toBe(200);
            expect(response.body.result.error).toBeUndefined();
            expect(response.body.result).toBeInstanceOf(Array);
        });

        it("should throw an error if the user does not have the administrator role", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email, password: "password"});

            const response = await request(app).get("/api/users/list").set("Authorization", `Bearer ${login.body.result.accessToken}`); 

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");
        });
    });

    describe("/api/users/password/change", () => {
        let user;
        beforeAll(async () => {
            user = await User.create({
                username: "user_change_test",
                email: "user_change_test@gmail.com",
                password: "password"
            });
        });

        it("should successfully change the user's password", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email, password: "password"});

            const response = await request(app).post("/api/users/password/change").set("Authorization", `Bearer ${login.body.result.accessToken}`).send({user: {userId: `${user._id}`, newPassword: "new_password"}}); 

            expect(response.body.result.success).toBeTruthy();
            expect(response.body.result.error).toBeUndefined();
        });

        it("should throw an error if the user ID does not match with their JWT access token", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email, password: "password"});

            const response = await request(app).post("/api/users/password/change").set("Authorization", `Bearer ${login.body.result.accessToken}`).send({user: {userId: "6817f1700000000000000000", newPassword: "new_password"}}); 

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");
        });
    });

    describe("/api/users/update/:id", () => {
        let admin;
        let user;
        beforeAll(async () => {
            admin = await User.create({
                username: "admin_update_test",
                email: "admin_update_test@gmail.com",
                password: "password",
                role: "administrator"
            });

            user = await User.create({
                username: "user_update_test",
                email: "user_update_test@gmail.com",
                password: "password"
            });
        });

        it("should successfully change the user's role and email", async () => {
            const login = await request(app).post("/api/users/login").send({email: admin.email, password: "password"});

            const response = await request(app).post(`/api/users/update/${admin._id}`).set("Authorization", `Bearer ${login.body.result.accessToken}`).send({user: {role: "analyst", email: "admin_updated@gmail.com"}}); 

            expect(response.body.result.error).toBeUndefined();
        });

        it("should throw an error if the user does not have the admin role", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email, password: "password"});

            const response = await request(app).post(`/api/users/update/${user._id}`).set("Authorization", `Bearer ${login.body.result.accessToken}`).send({user: {role: "administrator", email: "user_updated@gmail.com"}}); 

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");

        });
    });
});