const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Alert = require("../models/Alert");
const User = require("../models/User");
require("dotenv").config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
});
  
afterAll(async () => {
    await mongoose.disconnect();
});

describe("Alerts API Route and Controller", () => {
    describe("/api/alerts/list", () => {
        let user;

        beforeAll(async() => {
            user = await User.create({
                username: "alert_test",
                email: "alert_test@gmail.com",
                password: "password"
            });

            await Alert.create({
                endpoint_id: "6817f1700000000000000000",
                artifact_id: "6817f1700000000000240000",
                artifact_collection: "processes",
                host_name: "tam-macbook",
                detection: "Script",
                trigger: "./malicious-script.sh",
                score: 11,
                severity: "High",
                message: "Dangerous script detected"       
            });
        });

        it("should successfully list all stored alerts", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email, password: "password"});

            const response = await request(app).get("/api/alerts/list").set("Authorization", `Bearer ${login.body.result.accessToken}`);

            expect(response.body.result.error).toBeUndefined();
            expect(response.body.result).toBeInstanceOf(Array);
        });
    });
});