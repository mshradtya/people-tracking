// const express = require("express");
// var cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const users = require("../features/user/user.route");
// const gateways = require("../features/gateway/gateway.route");
// const beacons = require("../features/beacon/beacon.route");
// const connectPoints = require("../features/connect-point/connect-point.route");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");

// function createServer() {
//   const app = express();
//   const API = process.env.API_URL;
//   const allowedOrigins = [
//     "http://localhost:5173",
//     "http://localhost:3000",
//     "http://localhost:4000",
//   ];
//   const corsOptions = {
//     // origin: process.env.ORIGIN,
//     origin: allowedOrigins,
//     credentials: true,
//   };

//   app.use(cors(corsOptions));
//   app.use(express.json());
//   app.use(cookieParser());

//   const formatTimestamp = () => {
//     const now = new Date();
//     return now.toLocaleString("en-GB", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: false,
//     });
//   };

//   morgan.token("timestamp", formatTimestamp);
//   morgan.token("LOCATION", (req) => req.query.LOCATION || "-");
//   morgan.token("GWID", (req) => req.query.GWID || "-");
//   morgan.token("CPID", (req) => req.query.CPID || "-");
//   morgan.token("BNID", (req) => req.query.BNID || "-");
//   morgan.token("SOS", (req) => req.query.SOS || "-");
//   morgan.token("IDLE", (req) => req.query.IDLE || "-");
//   morgan.token("BATTERY", (req) => req.query.BATTERY || "-");

//   const logFormat =
//     ":timestamp  LOCATION=:LOCATION  GWID=:GWID   CPID=:CPID   BNID=:BNID   SOS=:SOS   IDLE=:IDLE   BATTERY=:BATTERY   :status   :res[content-length]  -   :response-time ms";

//   // Create a write stream (in append mode)
//   const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, "access.log"),
//     { flags: "a" }
//   );

//   // Custom middleware to conditionally log requests
//   app.use((req, res, next) => {
//     if (req.query.GWID !== "0") {
//       morgan(logFormat, { stream: accessLogStream })(req, res, next);
//     } else {
//       next();
//     }
//   });

//   app.use(morgan(logFormat));

//   app.use(function (err, req, res, next) {
//     if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
//       res
//         .status(400)
//         .json(
//           "The server did not receive a valid JSON. Please try checking for syntax errors."
//         );
//     }
//   });

//   app.use(`${API}`, users);
//   app.use(`${API}`, gateways);
//   app.use(`${API}`, beacons);
//   app.use(`${API}`, connectPoints);

//   return app;
// }

// module.exports = createServer;

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
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4000",
  ];
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
