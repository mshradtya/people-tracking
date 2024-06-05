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

// const express = require("express");
// const cors = require("cors");
// const users = require("../features/user/user.route");
// const gateways = require("../features/gateway/gateway.route");
// const beacons = require("../features/beacon/beacon.route");
// const connectPoints = require("../features/connect-point/connect-point.route");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
// const fs = require("fs");
// const path = require("path");

// function createServer() {
//   const app = express();
//   const API = process.env.API_URL;
//   const allowedOrigins = [
//     "http://localhost:5173",
//     "http://localhost:3000",
//     "http://localhost:4000",
//   ];
//   const corsOptions = {
//     origin: allowedOrigins,
//     credentials: true,
//   };

//   // Create a write stream (in append mode) for logging
//   const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
//     flags: "a",
//   });

//   // Define a custom token for readable date and time
//   morgan.token("date", function () {
//     const now = new Date();
//     const formattedDate = `${now.getFullYear()}-${padZero(
//       now.getMonth() + 1
//     )}-${padZero(now.getDate())}`;
//     const formattedTime = `${padZero(now.getHours())}:${padZero(
//       now.getMinutes()
//     )}:${padZero(now.getSeconds())}`;
//     return `${formattedDate} ${formattedTime}`;
//   });

//   // Define a function to pad single-digit numbers with a leading zero
//   function padZero(num) {
//     return (num < 10 ? "0" : "") + num;
//   }

//   // Define a custom format for morgan using the new date token
//   morgan.format(
//     "custom",
//     ":date :method :url :status :res[content-length] - :response-time ms"
//   );

//   // Setup morgan to log requests to the file using the custom format
//   app.use(morgan("custom", { stream: logStream }));

//   app.use(cors(corsOptions));
//   app.use(express.json());
//   app.use(cookieParser());

//   // Error handling for invalid JSON
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
