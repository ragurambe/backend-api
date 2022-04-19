const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const { mongoURI } = require("./config/keys");

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.info(`Mongo [${ENV}] connection successfully.`))
  .catch((err) => {
    console.error(`Mongo [${ENV}] connection ERROR! `, err);
  });

const app = express();
app.set("etag", false);
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//setting public resources middleware
app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// routes
app.use("/status", (req, res) => res.sendStatus(200));
app.use("/users", require("./routes/user"));

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`${ENV}: Node API listening on port ${PORT} ;]`);
});
