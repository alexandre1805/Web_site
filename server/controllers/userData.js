const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

exports.getFriends = async function (req, res) {
  var token = null;
  token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, verifiedJwt) => {
      if (err) {
        res.status(401);
      } else {
        var username = verifiedJwt.username
        const user = await userModel.findOne({ username });
        res.json(user.friends)
      }
    });
  } else {
    res.status(401);
  }
};
