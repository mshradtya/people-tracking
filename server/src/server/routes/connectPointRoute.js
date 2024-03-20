const express = require("express");
const router = express.Router();
const {
  registerConnectPoint,
  readAllConnectPoints,
  updateConnectPointCoords,
  updateConnectPointRoiCoords,
  //   deleteGateway,
  connectPointSosStatus,
} = require("../controllers/connectPointController");
const { authUser } = require("../controllers/authController");

router.post("/connect-point/register", authUser, registerConnectPoint);
router.get("/connect-points", authUser, readAllConnectPoints);
// router.delete("/gateway/delete/:id", authUser, deleteGateway);

// // map
router.post("/connect-point/update/coords", authUser, updateConnectPointCoords);
router.post(
  "/connect-point/update/roiCoords",
  authUser,
  updateConnectPointRoiCoords
);
router.get("/connect-point/sos", authUser, connectPointSosStatus);

module.exports = router;
