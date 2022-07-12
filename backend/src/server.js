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
const userData = require("./controllers/userData");

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
  //----------------------SOCKET INITIALISATION---------------------------------
  var rooms = await userRoom.getRoomsTab(socket.handshake.query.username);
  rooms.forEach((element) => {
    socket.join(element);
  });
  users.push({ socket: socket.id, username: socket.handshake.query.username });

  //----------------------FRIEND MANAGEMENT-------------------------------------
  socket.on("add Friend", async (args) => {
    const new_notif = await userData.addFriend(socket, args);
    const friend = users.filter((elm) => elm.username === args);
    if (friend.length !== 0)
      io.to(friend[0].socket).emit("notification", new_notif);
  });

  socket.on("accept invitation", async (args) => {
    await userData.acceptInvation(args);
  });

  //----------------------ROOM MANAGEMENT---------------------------------------
  socket.on("create Room", async (args) => {
    userRoom.createRoom(socket, args);
  });
  //----------------------MESSAGE MANAGEMENT------------------------------------
  socket.on("message", async (args) => {
    var obj = await userMsg.handleMsg(args);
    io.to(args.room).emit("new message", obj);
  });

  socket.on("disconnect", () => {
    users = users.filter((elm) => elm.socket !== socket.id);
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
