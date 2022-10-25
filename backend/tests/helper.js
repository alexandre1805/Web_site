const mongoose = require("mongoose");
const userModel = require("../src/models/users");

async function createUser(server, user, logged = false) {
  if (mongoose.connection.readyState !== 1) {
    console.error("DB not connected");
    return;
  }

  const new_user = new userModel(user);
  new_user.save();

  if (logged) {
    const response = await request(server).post("/login").send({
      username: username,
      password: password,
    });

    user.cookie = response.headers["set-cookie"][0];
    user.socket = io("http://localhost:3050", {
      query: {
        username: user.username,
      },
    });
  }

  return user;
}

async function deleteUser(user) {
  if (mongoose.connection.readyState !== 1) {
    console.error("DB not connected");
    return;
  }

  await userModel.deleteOne({ username: user.username, email: user.email });
}

module.exports = {
  createUser,
  deleteUser,
};
