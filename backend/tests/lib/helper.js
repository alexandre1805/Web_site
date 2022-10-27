const mongoose = require("mongoose");
const userModel = require("../../src/models/users");
const request = require("supertest");
const io = require("socket.io-client");

async function createUser(
  server,
  port,
  user,
  logged = false,
  friends = [],
  rooms = []
) {
  if (mongoose.connection.readyState !== 1) {
    console.error("DB not connected");
    return;
  }

  const new_user = new userModel(user);
  if (friends.length !== 0) new_user.friends = friends;
  if (rooms.length !== 0) new_user.rooms = rooms;
  new_user.save();

  if (logged) {
    const response = await request(server).post("/login").send({
      username: user.username,
      password: user.password,
    });

    user.cookie = response.headers["set-cookie"][0];
    user.socket = await io("http://localhost:" + port, {
      query: {
        username: user.username,
      },
    });
  }

  return user;
}

async function deleteUser(user, logged = false) {
  if (mongoose.connection.readyState !== 1) {
    console.error("DB not connected");
    return;
  }

  await userModel.deleteOne({ username: user.username, email: user.email });
  if (logged) user.socket.close();
}

function timeout(ms) {
  return new Promise((resolve) => {
    let t = setTimeout(resolve, ms);
    t.unref();
    return t;
  });
}

module.exports = {
  createUser,
  deleteUser,
  timeout,
};
