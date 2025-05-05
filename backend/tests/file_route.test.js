const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const File = require("../models/File");
const User = require("../models/User");
require("dotenv").config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
});
  
afterAll(async () => {
    await mongoose.disconnect();
});

describe("Files API Route and Controller", () => {
    describe("/api/files/list", () => {
        let user;

        beforeAll(async() => {
            user = await User.create({
                username: "file_test",
                email: "file_test@gmail.com",
                password: "password"
            });

            await File.create({
                endpoint_id: "6817f1700000000000000000",
                host_name: "tam-macbook",
                file_name: "test.txt",
                file_path: "/Users/testing/Downloads/test.txt",
                sha256_hash: "340b740ce2cd20c72b33b222353b7cd2afd42fcaa58e6868a1d532b7c969fb95",
                creation_ts: 1746483243,
                last_mod_ts: 1746483243,
                file_size: 24,
                file_description: "ASCII Text"
            });
        });

        it("should successfully list all stored files", async () => {
            const login = await request(app).post("/api/users/login").send({email: user.email, password: "password"});

            const response = await request(app).get("/api/files/list").set("Authorization", `Bearer ${login.body.result.accessToken}`);

            expect(response.body.result.error).toBeUndefined();
            expect(response.body.result).toBeInstanceOf(Array);
        });
    });
});