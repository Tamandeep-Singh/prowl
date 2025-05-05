const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Endpoint = require("../models/Endpoint");
const User = require("../models/User");
require("dotenv").config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
});
  
afterAll(async () => {
    await mongoose.disconnect();
});

describe("Endpoints API Route and Controller", () => {
    describe("/api/endpoints/list", () => {
        let user;

        beforeAll(async() => {
            user = await User.create({
                username: "endpoint_test",
                email: "endpoint_test@gmail.com",
                password: "password"
            });

            await Endpoint.create({
                host_uuid: "b0235f77-a7bf-475f-b36e-aa9d64a1302d",
                host_name: "tam-macbook",
                host_ip: "192.168.1.79",
                host_os: "MacOS",
                host_os_version: "MacOS 15.4.1"
            });
        });

        it("should successfully list all stored endpoints", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email, password: "password"});

            const response = await request(app).get("/api/endpoints/list").set("Authorization", `Bearer ${login.body.result.accessToken}`);

            expect(response.body.result.error).toBeUndefined();
            expect(response.body.result).toBeInstanceOf(Array);
        });
    });

    describe("/api/endpoints/link", () => {

        it("should successfully link an endpoint to the system", async () => {
            const response = await request(app).post("/api/endpoints/link").send({
                endpoint: {
                    host_uuid: "3d2b4eac-50a4-4ce1-9dce-b991deb8b425",
                    host_name: "tam-windows",
                    host_ip: "192.168.2.23",
                    host_os: "Windows",
                    host_os_version: "Windows 10 (Pro)"
                }
            });

            expect(response.body.result.error).toBeUndefined();
        });

        it("should throw an error when an endpoint is invalid", async () => {
            const response = await request(app).post("/api/endpoints/link").send({
                endpoint: {
                    host_uuid: "3d2b4eac-50a4-4ce1-9dce-b991deb8b425",
                    host_os_version: "Windows 10 (Pro)"
                }
            });

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");
        });
    });

    describe("/api/endpoints/ingest", () => {
        let endpoint;

        beforeAll(async () => {
            endpoint = await Endpoint.create({
                host_uuid: "dd31cd62-c7df-4e2c-b321-8d79aaef22fa",
                host_name: "tam-linux",
                host_ip: "192.168.1.54",
                host_os: "Linux",
                host_os_version: "Ubuntu (22.0.4)"
            });
        });

        it("should successfully ingest process data ", async () => {
            const response = await request(app).post("/api/endpoints/ingest").send({
                host_uuid: endpoint.host_uuid,
                host_name: endpoint.host_name,
                agent_pid: 20,
                ingest_type: "processes",
                processes: [{
                    ppid: 4,
                    pid: 3128,
                    user: "root",
                    state: "Ss",
                    command: "/usr/bin/manager",
                    start_time: "Fri 25 Apr 23:41:26 2025",
                    elapsed_time: "01-01:04:21"
                }]
            });

            expect(response.body.result.error).toBeUndefined();
        });

        it("should successfully ingest filesystem data ", async () => {
            const response = await request(app).post("/api/endpoints/ingest").send({
                host_uuid: endpoint.host_uuid,
                host_name: endpoint.host_name,
                ingest_type: "files",
                files: [{
                    file_name: "test.sh",
                    file_path: "/Users/testing/Downloads/test.sh",
                    sha256_hash: "28b740ce2cd20c72b33b222353b7cd2afe42fcaa58e6868a1d532b7c969fb24",
                    creation_ts: 1746483143,
                    last_mod_ts: 1746483243,
                    file_size: 680,
                    file_description: "executable"
                }]
            });

            expect(response.body.result.error).toBeUndefined();
        });

        it("should successfully ingest network connection data ", async () => {
            const response = await request(app).post("/api/endpoints/ingest").send({
                host_uuid: endpoint.host_uuid,
                host_name: endpoint.host_name,
                ingest_type: "network",
                network_connections: [{
                    command: "mongod",
                    pid: 4008,
                    local_address_ip: "127.0.0.1",
                    local_address_port: 27017,
                    remote_address_ip: "127.0.0.1",
                    remote_address_port: 27017,
                    connection_status: "ESTABLISHED"
                }]
            });

            expect(response.body.result.error).toBeUndefined();
        });

        it("should throw an error when provided with an invalid ingest type", async () => {
            const response = await request(app).post("/api/endpoints/ingest").send({
                host_uuid: endpoint.host_uuid,
                host_name: endpoint.host_name,
                ingest_type: "invalid",
                network_connections: []
            });

            expect(response.body.result.success).toBeFalsy();
            expect(response.body.result).toHaveProperty("error");
        });
    });
});
