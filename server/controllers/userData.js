const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

exports.getFriends = async function (req, res) {
  var username = verifiedJwt.username;
  const user = await userModel.findOne({ username });
  res.json(user.friends);
};
