/*const app = require("../src/utils/app");
const request = require("supertest");
const mongoose = require("mongoose");
const userModel = require("../src/models/users");
const notificationModel = require("../src/models/notification");
const io = require("socket.io-client");
require("dotenv").config();

let user1, user2, server;
async function createUser(user) {
  await request(server).post("/register").send({
    username: user.username,
    email: user.email,
    password: user.password,
  });
  const response = await request(server).post("/login").send({
    username: user.username,
    password: user.password,
  });
  user["cookie"] = response.headers["set-cookie"][0];
  user["socket"] = io("http://localhost:3050", {
    query: {
      username: user.username,
    },
  });

  return user;
}

beforeAll(async () => {
  server = app();
  server.listen(4000);
  //create the user
});
beforeEach(async () => {
  user1 = { username: "test1", email: "test1@gmail.com", password: "toto" };
  user1 = await createUser(user1);
  user2 = { username: "test2", email: "test2@gmail.com", password: "toto" };
  user2 = await createUser(user2);
});

describe("User Data", () => {
  describe("Friends", () => {
    test("Get Friends without token", async () => {
      const response = await request(server).get("/getFriends").expect(404);
      expect(response.body.hasOwnProperty("message"));
      expect(response.body).toMatchObject({
        message: "No token",
      });
    });

    test("Get Notification without token", async () => {
      const response = await request(server).get("/getNotifs").expect(404);
      expect(response.body.hasOwnProperty("message"));
      expect(response.body).toMatchObject({
        message: "No token",
      });
    });

    test("Get Friends with no friends", async () => {
      const response = await request(server)
        .get("/getFriends")
        .set("Cookie", [user1.cookie])
        .expect(200);
      expect(response.body.hasOwnProperty("friends"));
      expect(response.body).toMatchObject({
        friends: [],
      });
    });

    test("Add friend with empty username", (done) => {
      user1.socket.emit("add Friend", "");
      user1.socket.on("add Friend return", (arg) => {
        expect(arg).toMatch("You must specify a friend.");
        done();
      });
    });

    test("Add friend with unknown username", (done) => {
      user1.socket.emit("add Friend", "unknwon_user");
      user1.socket.on("add Friend return", (arg) => {
        expect(arg).toMatch("the user does not exist");
        done();
      });
    });

    test("Add friend with empty username", (done) => {
      user1.socket.emit("add Friend", "");
      user1.socket.on("add Friend return", (arg) => {
        expect(arg).toMatch("You must specify a friend.");
        done();
      });
    });
    test("Add friend, with expect return for the sender", (done) => {
      user1.socket.emit("add Friend", user2.username);
      user1.socket.on("add Friend return", (arg) => {
        expect(arg).toMatch("Invitation sended.");
        done();
      });
    });

    test("Add friend, with expect return for the receiver (test on socket)", (done) => {
      user1.socket.emit("add Friend", user2.username);
      user2.socket.on("notification", (arg) => {
        expect(arg).toMatchObject({
          type: "add_friend",
          username: "test2",
          message: "test1 wants to add you as friend !",
          from: "test1",
        });
        done();
      });
    });

    test("Add friend, with expect return for the receiver (test on api route)", (done) => {
      user1.socket.emit("add Friend", user2.username);
      setTimeout(async () => {
        const response = await request(server)
          .get("/getNotifs")
          .set("Cookie", [user2.cookie])
          .expect(200);
        expect(response.body).toMatchObject([
          {
            type: "add_friend",
            username: "test2",
            message: "test1 wants to add you as friend !",
            from: "test1",
          },
        ]);
        done();
      }, 500);
    });

    test("Accept invitation (check notif of user)", (done) => {
      user1.socket.emit("add Friend", user2.username);
      setTimeout(async () => {
        const response = await request(server)
          .get("/getNotifs")
          .set("Cookie", [user2.cookie]);
        user2.socket.emit("accept invitation", response.body[0]);
        setTimeout(async () => {
          const response = await request(server)
            .get("/getNotifs")
            .set("Cookie", [user2.cookie])
            .expect(200);
          expect(response.body.length).toBe(0);
          done();
        }, 500);
      }, 500);
    });

    test("Accept invitation (check friend of users)", (done) => {
      user1.socket.emit("add Friend", user2.username);
      setTimeout(async () => {
        const response = await request(server)
          .get("/getNotifs")
          .set("Cookie", [user2.cookie]);
        user2.socket.emit("accept invitation", response.body[0]);
        setTimeout(async () => {
          const response = await request(server)
            .get("/getFriends")
            .set("Cookie", [user2.cookie])
            .expect(200);
          expect(response.body).toMatchObject({
            friends: [{ username: "test1" }],
          });

          const response2 = await request(server)
            .get("/getFriends")
            .set("Cookie", [user1.cookie])
            .expect(200);
          expect(response2.body).toMatchObject({
            friends: [{ username: "test2" }],
          });
          done();
        }, 500);
      }, 500);
    });

    test("Send invitation to a user who is already a friend", (done) => {
      user1.socket.emit("add Friend", user2.username);
      setTimeout(async () => {
        const response = await request(server)
          .get("/getNotifs")
          .set("Cookie", [user2.cookie]);
        user2.socket.emit("accept invitation", response.body[0]);
        setTimeout(async () => {
          user1.socket.emit("add Friend", user2.username);
          user1.socket.on("add Friend return", (arg) => {
            expect(arg).toMatch(user2.username + " is already your friend.");
            done();
          });
        }, 500);
      }, 500);
    });
  });
});

afterEach(async () => {
  await userModel.deleteOne({ username: user1.username });
  await userModel.deleteOne({ username: user2.username });
  await notificationModel.deleteMany({ from: user1.username });
  await user1.socket.close();
  await user2.socket.close();
});

afterAll(async () => {
  await server.close();
  mongoose.disconnect();
});
*/
