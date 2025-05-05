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

describe("Events API Route and Controller", () => {
    describe("/api/events/count", () => {
        let user;

        beforeAll(async() => {
            user = await User.create({
                username: "events_test",
                email: "events_test@gmail.com",
                password: "password"
            });
        });

        it("should successfully list all counts of events across all collections", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email, password: "password"});

            const response = await request(app).get("/api/events/count").set("Authorization", `Bearer ${login.body.result.accessToken}`);

            expect(response.body.result.success).toBeTruthy();
            expect(response.body.result.error).toBeUndefined();
            expect(response.body.result).toHaveProperty("counts");
            expect(response.body.result.counts).toHaveProperty("processes");
            expect(response.body.result.counts).toHaveProperty("files");
            expect(response.body.result.counts).toHaveProperty("endpoints");
            expect(response.body.result.counts).toHaveProperty("reports");
            expect(response.body.result.counts).toHaveProperty("networkConnections");
            expect(response.body.result.counts).toHaveProperty("alerts");
        });
    });
});