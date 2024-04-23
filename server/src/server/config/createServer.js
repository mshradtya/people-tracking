const express = require("express");
var cors = require("cors");
const users = require("../features/user/user.route");
const gateways = require("../features/gateway/gateway.route");
const beacons = require("../features/beacon/beacon.route");
const connectPoints = require("../features/connect-point/connect-point.route");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

function createServer() {
  const app = express();
  const API = process.env.API_URL;
  const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
  const corsOptions = {
    // origin: process.env.ORIGIN,
    origin: allowedOrigins,
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan("tiny"));
  app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      res
        .status(400)
        .json(
          "The server did not receive a valid JSON. Please try checking for syntax errors."
        );
    }
  });
  app.use(`${API}`, users);
  app.use(`${API}`, gateways);
  app.use(`${API}`, beacons);
  app.use(`${API}`, connectPoints);
  return app;
}

module.exports = createServer;
