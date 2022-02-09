const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

exports.registerUser = async function (req, res) {
  const usernameFound = await userModel.findOne({
    username: req.body.username,
  });
  const emailFound = await userModel.findOne({ email: req.body.email });

  console.log(usernameFound);
  if (usernameFound) res.json({ message: "Username already taken" });
  else if (emailFound) res.json({ message: "Email already taken" });
  else {
    const newUser = new userModel({
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    });

    newUser.save();

    res.json({ message: "Success" });
  }
};

exports.login = async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = await userModel.findOne({ username });
  if (!user || user.password != password)
    res.json({ message: "Invalid login" });
  else {
    const token = jwt.sign(
      { username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.header("Authorization", "Bearer " + token);
    res.json({ message: "Success" });
  }
};

exports.verifToken = function (req, res, next) {
  let token = req.headers["Authorization"];
  if (!!token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
      if (err) {
        res.status("401").json({ message: err.message });
      } else {
        res.send("Success");
      }
    });
  }
  res.status("401").json({ message: "No token" });
};
