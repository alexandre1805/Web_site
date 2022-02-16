const express = require("express");
const userAuth = require("../controllers/userAuth");
const router = express.Router();

router.post("/register", userAuth.registerUser);
router.post("/login", userAuth.login);
router.get("/verifToken", userAuth.verifToken)

module.exports = router;
