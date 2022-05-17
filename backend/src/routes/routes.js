const express = require("express");
const jwt = require("jsonwebtoken");
const userAuth = require("../controllers/userAuth");
const userData = require("../controllers/userData");
const userMsg = require("../controllers/userMsg");
const userRoom = require("../controllers/userRoom");
const router = express.Router();

router.post("/register", userAuth.registerUser);
router.post("/login", userAuth.login);
router.get("/verifToken", userAuth.verifToken);
router.get("/getFriends", userData.getFriends);
router.post("/addFriend", userData.addFriend);
router.get("/getMsg", async (req, res) => {
  await userMsg.getMessages(req, res);
});
router.get("/getRooms", async (req, res) => {
  await userRoom.getRooms(req, res);
});

module.exports = router;
