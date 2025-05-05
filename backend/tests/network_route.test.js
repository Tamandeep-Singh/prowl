const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const NetworkConnection = require("../models/Network_Connection");
const User = require("../models/User");
require("dotenv").config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
});
  
afterAll(async () => {
    await mongoose.disconnect();
});

describe("Network Connections API Route and Controller", () => {
    describe("/api/network_connections/list", () => {
        let user;

        beforeAll(async() => {
            user = await User.create({
                username: "network_test",
                email: "network_test@gmail.com",
                password: "password"
            });

            await NetworkConnection.create({
                endpoint_id: "6817f1700000000000000000",
                host_name: "tam-macbook",
                command: "mDNSResponder",
                pid: 5624,
                local_address_ip: "127.0.0.1",
                local_address_port: 4001,
                remote_address_ip: "127.0.0.1",
                remote_address_port: 49671,
                connection_status: "ESTABLISHED"
            });
        });

        it("should successfully list all stored network connections", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email, password: "password"});

            const response = await request(app).get("/api/network_connections/list").set("Authorization", `Bearer ${login.body.result.accessToken}`);

            expect(response.body.result.error).toBeUndefined();
            expect(response.body.result).toBeInstanceOf(Array);
        });
    });
});