const express = require("express");
const userAuth = require("../controllers/userAuth");
const router = express.Router();

router.post("/register", userAuth.registerUser);

module.exports = router;
