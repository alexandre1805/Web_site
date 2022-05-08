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
const ioFunc = require("./controllers/userMsg.js");

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
let online_users = [];

io.on("connection", (socket) => {
  online_users.push(socket)

  socket.on("message", async (args) => {
    var obj = await ioFunc.handleMsg(args);
    io.emit("new message", obj);
  });

  socket.on("disconnect", () => {
    console.log(`Deconnecté au client ${socket.id}`);
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
