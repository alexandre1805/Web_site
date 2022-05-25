const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./routes/routes");
const cors = require("cors");
const userMsg = require("./controllers/userMsg.js");
const userRoom = require("./controllers/userRoom");

//app use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", router);
app.use(cors());

// **********************************
// *                                *
// *        DATABASE : MONGODB      *
// *                                *
// **********************************
mongoose.connect(process.env.MongoDB);
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});
db.on("connected", () => console.log("DB connected"));

// **********************************
// *                                *
// *          SOCKET IO             *
// *                                *
// **********************************

let users = [];
io.on("connection", async (socket) => {
  // connect user to room
  var rooms = await userRoom.getRoomsTab(socket.handshake.query.username);
  rooms.forEach((element) => {
    socket.join(element);
  });

  socket.on("message", async (args) => {
    var obj = await userMsg.handleMsg(args);
    io.emit("new message", obj);
  });

  socket.on("create room", async (args) => {
    userRoom.createRoom(args);
    socket.emit("create room");
  });

  socket.on("disconnect", () => {});
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
