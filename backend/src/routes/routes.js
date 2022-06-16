const express = require("express");
const jwt = require("jsonwebtoken");
const userAuth = require("../controllers/userAuth");
const userData = require("../controllers/userData");
const userMsg = require("../controllers/userMsg");
const userRoom = require("../controllers/userRoom");
const router = express.Router();

/**
 * @api {post} /register Request User regestration
 * @apiName Register
 * @apiGroup User
 * @apiVersion 0.0.0
 *
 * @apiBody {String} username the username of the new user
 * @apiBody {String} email the email of the new user
 * @apiBody {String} password the username of the new user
 * @apiParamExample {json} Request body example :
 * {
 *    "username" : "toto
 *    "email" : "toto@gmail.com"
 *    "password" : "1234"
 * }
 *
 * @apiError UsernameTaken username already taken
 * @apiError EmailExists email already exists
 *
 * @apiSuccess {String} message   written normally "OK"
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message" : "OK"
 *     }
 * @apiSampleRequest http://localhost:4000/register
 */
router.post("/register", userAuth.registerUser);

/**
 * @api {post} /login Request User login
 * @apiName Login
 * @apiGroup User
 * @apiVersion 0.0.0
 *
 * @apiBody {String} username username
 * @apiBody {String} password password
 * @apiParamExample {json} Request body example :
 * {
 *    "username" : "toto"
 *    "password" : "123"
 * }
 *
 * @apiError InvalidLogin the login does not exist or the password does not match, we can notice that ther is a Json with the message "Invalid login"
 * @apiSuccess {String} message   written normally "OK"
 * @apiSuccess {String} token this is the token used to authentify the user on each request
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message" : "OK"
 *     }
 * @apiSampleRequest http://localhost:4000/login
 */
router.post("/login", userAuth.login);
/**
 * @api {get} /verifToken Request User token verification
 * @apiName Token Verification
 * @apiGroup User
 * @apiVersion 0.0.0
 *
 * @apiHeader {String} token the token previously set with login request
 *
 * @apiError InvalidToken
 * @apiError NoToken
 *
 * @apiSuccess {String} username
 * @apiSuccess {String} message always "OK"
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username" : "toto"
 *       "message" : "OK"
 *     }
 *
 *  @apiSampleRequest http://localhost:4000/verifToken
 */
router.get("/verifToken", userAuth.verifToken);
/**
 * @api {get} /getFriends Request User get friends
 * @apiName Get Friend
 * @apiGroup User
 * @apiVersion 0.0.0
 *
 * @apiHeader {String} token the token previously set with login request
 *
 * @apiError InvalidToken
 * @apiError NoToken
 *
 * @apiSuccess {String[]} friends list of friends of the user
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "friends" : [
 *          "toto",
 *          "tata",
 *          "titi"
 *      ]
 *     }
 * @apiSampleRequest http://localhost:4000/getFriends
 */
router.get("/getFriends", userData.getFriends);
/**
 * @api {get} /getMsg Request User get messages
 * @apiName Get Messages
 * @apiGroup User
 * @apiVersion 0.0.0
 *
 * @apiHeader {String} token the token previously set with login request
 *
 * @apiError InvalidToken
 * @apiError NoToken
 *
 * @apiSuccess {String[]} messages return all the messages from the database
 *
 */
router.get("/getMsg", async (req, res) => {
  await userMsg.getMessages(req, res);
});
/**
 * @api {get} /getMsg Request User get rooms
 * @apiName Get Rooms
 * @apiGroup User
 * @apiVersion 0.0.0
 *
 * @apiHeader {String} token the token previously set with login request
 *
 * @apiError InvalidToken
 * @apiError NoToken
 *
 * @apiSuccess {String[]} rooms return all the roomes from the database
 *
 */
router.get("/getRooms", async (req, res) => {
  await userRoom.getRooms(req, res);
});
/**
 * @api {get} /getNotif Request User get rooms
 * @apiName Get Notifications
 * @apiGroup User
 * @apiVersion 0.0.0
 *
 * @apiHeader {String} token the token previously set with login request
 *
 * @apiError InvalidToken
 * @apiError NoToken
 *
 * @apiSuccess {String[]} Notifications return all the Notifications from the database
 *
 */
router.get("/getNotif", async (req, res) => {
  await userData.getNotif(req, res);
});

module.exports = router;
