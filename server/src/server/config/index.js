const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const createServer = require("./createServer");
const createAdmin = require("../utils/createAdmin");

const db = process.env.MONGO_URI;

mongoose
  .connect(db, {
    dbName: "people-tracking",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    await createAdmin();
    const app = createServer();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`app running on port: ${port} `);
    });
  })
  .catch((err) => {
    console.log("could not connect to mongodb and start the server");
    console.log(err);
  });
