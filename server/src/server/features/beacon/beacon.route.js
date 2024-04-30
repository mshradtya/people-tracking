const express = require("express");
const router = express.Router();
const {
  registerBeacon,
  registerBeaconUser,
  assignBeaconUser,
  readAllBeacons,
  readAllBeaconUsers,
  updateBeaconUserAck,
  updateBeacon,
  deleteBeacon,
  readAllSosHistory,
} = require("./beacon.controllers");
const { authUser } = require("../auth/auth.controllers");

router.post("/beacon/register", authUser, registerBeacon);
router.post("/beacon/user/register", authUser, registerBeaconUser);
router.post("/beacon/user/assign", authUser, assignBeaconUser);
router.get("/beacons", authUser, readAllBeacons);
router.get("/beacon/users", authUser, readAllBeaconUsers);
router.post("/beacon/update/ack", authUser, updateBeaconUserAck);
router.post("/beacon/update", updateBeacon);
router.delete("/beacon/delete/:id", authUser, deleteBeacon);
router.get("/beacon/sos/history", authUser, readAllSosHistory);

module.exports = router;
