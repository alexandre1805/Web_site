const express = require("express");
const userAuth = require("../controllers/userAuth");
const userData = require("../controllers/userData");
const router = express.Router();

router.post("/register", userAuth.registerUser);
router.post("/login", userAuth.login);
router.get("/verifToken", userAuth.verifToken);
router.get("/getFriends", userData.getFriends);

module.exports = router;
