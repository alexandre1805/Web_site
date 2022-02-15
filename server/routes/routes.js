const express = require("express");
const userAuth = require("../controllers/userAuth");
const router = express.Router();

router.post("/register", userAuth.registerUser);
router.post("/login", userAuth.login);

module.exports = router;
