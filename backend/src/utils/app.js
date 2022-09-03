const express = require("express");
const cookieParser = require("cookie-parser");
const router = require("../routes/routes");
const cors = require("cors");
const userMsg = require("../controllers/userMsg.js");
const userRoom = require("../controllers/userRoom");
const userData = require("../controllers/userData");
const Tictactoe = require("../controllers/Tic-tac-toe");
const Connect4 = require("../controllers/Connect-4");
const games = require("../controllers/games-connection");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

function app() {
  require("dotenv").config();
  const app = express();
  const server = require("http").Server(app);
  const io = require("socket.io")(server);
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

  // **********************************
  // *                                *
  // *          SOCKET IO             *
  // *                                *
  // **********************************

  const users = new Map();
  io.on("connection", async (socket) => {
    //----------------------SOCKET INITIALISATION-------------------------------
    var rooms = await userRoom.getRoomsTab(socket.handshake.query.username);
    rooms.forEach((element) => {
      socket.join(element);
    });
    users.set(socket.handshake.query.username, socket.id);

    //----------------------FRIEND MANAGEMENT-----------------------------------
    socket.on("add Friend", async (args) => {
      if (args === "" || args === undefined) {
        socket.emit("add Friend return", "You must specify a friend.");
        return;
      }
      const new_notif = await userData.addFriend(socket, args);
      const friend = users.get(args);
      io.to(friend).emit("notification", new_notif);
    });

    socket.on("accept invitation", async (args) => {
      await userData.acceptInvation(args);
    });

    socket.on("delete notification", async (id) => {
      await userData.deleteNotifications(id);
    });

    //----------------------ROOM MANAGEMENT-------------------------------------
    socket.on("create Room", async (args) => {
      await userRoom.createRoom(io, socket, users, args);
    });
    //----------------------MESSAGE MANAGEMENT----------------------------------
    socket.on("message", async (args) => {
      var obj = await userMsg.handleMsg(socket, args);
      if (obj !== null) io.to(args.room).emit("new message", obj);
    });
    socket.on("read", (args) => {
      userMsg.handleRead(args);
    });
    //----------------------GAME MANAGEMENT-------------------------------------
    socket.on("join", async (args) => {
      socket.join(args.id);
      await games.join(io, args);
    });

    socket.on("leave", async (args) => {
      socket.leave(args.id);
      await games.leave(io, args);
    });

    socket.on("Tic-tac-toe update-client", async (args) => {
      await Tictactoe.update(io, args.id, args.game);
    });

    socket.on("Connect-4 update-client", async (args) => {
      await Connect4.update(io, args.id, args.game);
    });
    socket.on("disconnecting", () => {
      let gameRooms = Array.from(socket.rooms).filter((elm) =>
        elm.startsWith("game-")
      );
      gameRooms.forEach((elm) =>
        games.leave(io, { id: elm, username: socket.handshake.query.username })
      );
      users.delete(socket.handshake.query.username);
    });
  });

  return server;
}

module.exports = app;
