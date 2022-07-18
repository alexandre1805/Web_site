const express = require("express");
const cookieParser = require("cookie-parser");
const router = require("../routes/routes");
const cors = require("cors");
const userMsg = require("../controllers/userMsg.js");
const userRoom = require("../controllers/userRoom");
const userData = require("../controllers/userData");
const Tictactoe = require("../controllers/Tic-tac-toe");
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

    //----------------------ROOM MANAGEMENT-------------------------------------
    socket.on("create Room", async (args) => {
      const new_room = await userRoom.createRoom(socket, args);
      if (new_room !== undefined) {
        for (let user in new_room.users) {
          if (users.get(new_room.users[user]) !== undefined) {
            io.sockets.sockets
              .get(users.get(new_room.users[user]))
              .join(new_room._id);
          }
        }
        io.to(new_room._id).emit("new room", new_room);
      }
    });
    //----------------------MESSAGE MANAGEMENT----------------------------------
    socket.on("message", async (args) => {
      var obj = await userMsg.handleMsg(args);
      io.to(args.room).emit("new message", obj);
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
