const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

exports.registerUser = async function (req, res) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  //check if all fields are present and not empty
  if (username == undefined || username === "") {
    res
      .status(200)
      .json({ message: "Username field is required not empty or undefined." });
    return;
  }

  if (email == undefined || email === "") {
    res
      .status(200)
      .json({ message: "Email field is required not empty or undefined." });
    return;
  }

  if (password == undefined || password === "") {
    res
      .status(200)
      .json({ message: "Password field is required not empty or undefined." });
    return;
  }

  const usernameFound = await userModel.findOne({ username: username });
  if (usernameFound) {
    res.status(200).json({ message: "Username already exists." });
    return;
  }

  const emailFound = await userModel.findOne({ email: email });
  if (emailFound) {
    res.status(200).json({ message: "Email already exists." });
    return;
  }

  const newUser = new userModel({
    username: req.body.username,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  });

  newUser.save();

  res.status(200).json({ message: "OK" });
};

exports.login = async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username == undefined || username === "") {
    res
      .status(200)
      .json({ message: "Username field is required not empty or undefined." });
    return;
  }

  if (password == undefined || password === "") {
    res
      .status(200)
      .json({ message: "Password field is required not empty or undefined." });
    return;
  }

  const user = await userModel.findOne({ username: username });
  if (!user || user.password != password) {
    res.status(200).json({ message: "Invalid login." });
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
        res.status(400).json({ message: "Token is invalid." });
      } else {
        res.status(200).json({ username: verifiedJwt.username, message: "OK" });
      }
    });
  } else {
    res.status(404).json({ message: "No token." });
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
