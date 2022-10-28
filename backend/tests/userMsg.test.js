const app = require("../src/utils/app");
const request = require("supertest");
const mongoose = require("mongoose");
const roomModel = require("../src/models/rooms");
const messageModel = require("../src/models/messages");
const helper = require("./lib/helper");
const MemoryDatabaseServer = require("./lib/MemoryDatabaseServer");

let server;
let port = 4004;
let room_id;
var user1;
var user2;
var user3;

beforeAll(async () => {
  await MemoryDatabaseServer.start();
  server = app();
  await mongoose.connect(MemoryDatabaseServer.getConnectionString());
  server.listen(port);

  user1 = { username: "test1", email: "test1@gmail.com", password: "toto" };
  user2 = { username: "test2", email: "test2@gmail.com", password: "toto" };
  user3 = { username: "test3", email: "test3@gmail.com", password: "toto" };
});

beforeEach(async () => {
  const room = new roomModel({
    type: "group",
    name: user1.username + ", " + user2.username + ", " + user3.username,
    users: [user1.username, user2.username, user3.username],
  });
  room_id = await room.save().then((obj) => {
    return obj.id;
  });
  user1 = await helper.createUser(
    server,
    port,
    user1,
    true,
    [user2.username, user3.usernames],
    [room_id]
  );
  user2 = await helper.createUser(
    server,
    port,
    user2,
    true,
    [user1.username, user3.usernames],
    [room_id]
  );
  user3 = await helper.createUser(
    server,
    port,
    user3,
    true,
    [user2.username, user1.usernames],
    [room_id]
  );
});

afterEach(async () => {
  await helper.deleteUser(user1, true);
  await helper.deleteUser(user2, true);
  await helper.deleteUser(user3, true);
  await roomModel.deleteMany({});
  await messageModel.deleteMany({});
});

describe("User Msg", () => {
  describe("Real-time Msg", () => {
    describe("Regular", () => {
      test("Regular message when user1 connected", (done) => {
        user1.socket.on("new message", (args) => {
          expect(args).toMatchObject({
            message: "test",
            read: [],
            type: "regular",
            user: user1.username,
          });
          done();
        });
        user1.socket.emit("message", {
          type: "regular",
          room: room_id,
          message: "test",
          user: user1.username,
        });
      });

      test("Regular message when user2 connected", (done) => {
        user2.socket.on("new message", (args) => {
          expect(args).toMatchObject({
            message: "test",
            read: [],
            type: "regular",
            user: user1.username,
          });
          done();
        });
        user1.socket.emit("message", {
          type: "regular",
          room: room_id,
          message: "test",
          user: user1.username,
        });
      });
    });
    describe("Games Msg", () => {
      test("Game message when user1 connected", (done) => {
        user2.socket.on("new message", (args) => {
          expect(args).toMatchObject({
            type: "game",
            room: room_id,
            message: user1.username + " want to start a game : ",
            user: user1.username,
            game: "Connect 4",
            state: "Not started",
          });
          done();
        });
        user1.socket.emit("message", {
          type: "game",
          room: room_id,
          message: user1.username + " want to start a game : ",
          user: user1.username,
          game: "Connect 4",
          state: "Not started",
        });
      });
    });
  });

  describe("Msg reading", () => {
    test("Message read", async () => {
      user1.socket.emit("message", {
        type: "regular",
        room: room_id,
        message: "test",
        user: user1.username,
      });
      await helper.timeout(200);
      user1.socket.emit("read", { room: room_id, username: user1.username });
      await helper.timeout(200);
      let response = await messageModel.findOne({ message: "test" });
      expect(response).toMatchObject({
        message: "test",
        read: ["test1"],
        room: room_id,
        type: "regular",
        user: "test1",
      });
    });
  });
  describe("/getMsg", () => {
    test("/getMsg regular", async () => {
      user1.socket.emit("message", {
        type: "regular",
        room: room_id,
        message: "test",
        user: user1.username,
      });
      await helper.timeout(200);
      let response = await request(server)
        .get("/getMsg")
        .set("Cookie", [user1.cookie])
        .query({ room: room_id })
        .expect(200);
      expect(response.body).toMatchObject({
        messages: [
          {
            message: "test",
            read: [],
            room: room_id,
            type: "regular",
            user: user1.username,
          },
        ],
      });
    });

    test("/getMsg no token", async () => {
      user1.socket.emit("message", {
        type: "regular",
        room: room_id,
        message: "test",
        user: user1.username,
      });
      await helper.timeout(200);
      let response = await request(server)
        .get("/getMsg")
        .query({ room: room_id })
        .expect(200);
      expect(response.body).toMatchObject({
        message: "No token",
      });
    });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.close();
  await MemoryDatabaseServer.stop();
});
