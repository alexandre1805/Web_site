const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

exports.registerUser = async function (req, res) {
  const usernameFound = await userModel.findOne({
    username: req.body.username,
  });
  if (usernameFound)
    res.status(400).json({ message: "Username already taken" });

  const emailFound = await userModel.findOne({ email: req.body.email });
  if (emailFound) res.status(400).json({ message: "Email already taken" });
  else {
    const newUser = new userModel({
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    });

    newUser.save();

    res.status(200).json({ message: "OK" });
  }
};

exports.login = async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const user = await userModel.findOne({ username });
  if (!user || user.password != password) {
    res.status(500).json({ message: "Invalid login" });
  } else {
    const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "OK" });
  }
};

exports.verifToken = function (req, res) {
  var token = null;
  token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(200).json({ username: verifiedJwt.username, message: "OK" });
      }
    });
  } else {
    res.status(500).json({ message: "No token" });
  }
};

exports.checkAuth = (req, res) => {
  var token = null;
  token = req.cookies.token;

  if (token) {
    return jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
      if (err) {
        res.status(401);
      } else {
        return verifiedJwt.username;
      }
    });
  } else {
    res.status(401);
  }
};
