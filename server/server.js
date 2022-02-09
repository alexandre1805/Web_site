const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const router = require("./routes/routes");

//app use
app.use("*", router);
app.use(express.json());

//database connection
mongoose.connect(process.env.MongoDB);
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});
db.on("connected", () => console.log("DB connected"));

const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
