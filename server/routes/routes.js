const express = require("express");
const jwt = require("jsonwebtoken");
const userAuth = require("../controllers/userAuth");
const userData = require("../controllers/userData");
const userMsg = require("../controllers/userMsg");
const router = express.Router();

function checkAuth(req, res, next) {
  var token = null;
  token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, verifiedJwt) => {
      if (err) {
        return res.status(401);
      } else {
        return next();
      }
    });
  } else {
    res.status(401);
  }
}

router.post("/register", userAuth.registerUser);
router.post("/login", userAuth.login);
router.get("/verifToken", userAuth.verifToken);
router.get("/getFriends", checkAuth, userData.getFriends);
router.get("/getMsg", checkAuth, userMsg.getMessages);

module.exports = router;
