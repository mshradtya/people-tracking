const express = require("express");
const router = express.Router();
const {
  registerBeacon,
  readAllBeacons,
  updateBeacon,
  deleteGateway,
} = require("../controllers/beaconController");
const { authUser } = require("../controllers/authController");

router.post("/beacon/register", authUser, registerBeacon);
router.get("/beacons", authUser, readAllBeacons);
router.post("/beacon/update", updateBeacon);
router.delete("/beacon/delete/:id", authUser, deleteGateway);

module.exports = router;
