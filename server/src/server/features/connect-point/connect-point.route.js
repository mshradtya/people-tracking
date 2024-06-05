const express = require("express");
const router = express.Router();
const {
  registerConnectPoint,
  connectPointsNotWorking,
  readAllConnectPoints,
  updateConnectPointCoords,
  updateConnectPointRoiCoords,
  deleteConnectPoint,
  connectPointSosStatus,
  refreshConnectPoints,
} = require("./connect-point.controllers");
const { authUser } = require("../auth/auth.controllers");

router.post("/connect-point/register", authUser, registerConnectPoint);
router.get("/connect-points", authUser, readAllConnectPoints);
router.get("/connect-points/not-working", authUser, connectPointsNotWorking);
router.delete("/connect-point/delete/:id", authUser, deleteConnectPoint);

// // map
router.post("/connect-point/update/coords", authUser, updateConnectPointCoords);
router.post(
  "/connect-point/update/roiCoords",
  authUser,
  updateConnectPointRoiCoords
);
router.get("/connect-point/sos", authUser, connectPointSosStatus);
router.post("/connect-point/refresh", authUser, refreshConnectPoints);

module.exports = router;
