const express = require("express");
const router = express.Router();
const {
  registerBeacon,
  registerBeaconUser,
  assignBeaconUser,
  readAllBeacons,
  readAllBeaconUsers,
  updateBeacon,
  deleteBeacon,
} = require("../controllers/beaconController");
const { authUser } = require("../controllers/authController");

router.post("/beacon/register", authUser, registerBeacon);
router.post("/beacon/user/register", authUser, registerBeaconUser);
router.post("/beacon/user/assign", authUser, assignBeaconUser);
router.get("/beacons", authUser, readAllBeacons);
router.get("/beacon/users", authUser, readAllBeaconUsers);
router.post("/beacon/update", updateBeacon);
router.delete("/beacon/delete/:id", authUser, deleteBeacon);

module.exports = router;
