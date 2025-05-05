const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Process = require("../models/Process");
const User = require("../models/User");
require("dotenv").config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
});
  
afterAll(async () => {
    await mongoose.disconnect();
});

describe("Processes API Route and Controller", () => {
    describe("/api/processes/list", () => {
        let user;

        beforeAll(async() => {
            user = await User.create({
                username: "process_test",
                email: "process_test@gmail.com",
                password: "password"
            });

            await Process.create({
                endpoint_id: "6817f1700000000000000000",
                host_name: "tam-macbook",
                ppid: 1,
                pid: 3127,
                user: "root",
                state: "Ss",
                command: "/usr/libexec/kernelmanagerd",
                start_time: "Fri 25 Apr 22:41:26 2025",
                elapsed_time: "01-01:05:23"
            });
        });

        it("should successfully list all stored processes", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email, password: "password"});

            const response = await request(app).get("/api/processes/list").set("Authorization", `Bearer ${login.body.result.accessToken}`);

            expect(response.body.result.error).toBeUndefined();
            expect(response.body.result).toBeInstanceOf(Array);
        });
    });
});