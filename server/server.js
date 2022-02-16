const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const router = require("./routes/routes");

//app use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use("/", router);

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
