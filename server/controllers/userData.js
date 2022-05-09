const jwt = require("jsonwebtoken");
const userModel = require("../models/users");
const userAuth = require("./userAuth");

exports.getFriends = async function (req, res) {
  var username = userAuth.checkAuth();
  console.log(username);
  const user = await userModel.findOne({ username });
  res.status(200).json(user.friends);
};

exports.addFriend = async function (req, res) {
  var username = req.data;
};
