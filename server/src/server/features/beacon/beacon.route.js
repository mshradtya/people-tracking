const express = require("express");
const router = express.Router();
const {
  registerBeacon,
  // registerBeaconUser,
  assignBeaconUser,
  readAllBeacons,
  // readAllBeaconUsers,
  updateBeaconUserAck,
  // updateBeaconBatteryLowFlag,
  updateBeacon,
  deleteBeacon,
  readAllSosHistory,
  readSosHistoryOfDate,
} = require("./beacon.controllers");
const { authUser } = require("../auth/auth.controllers");
const PathLogs = require("./temp/path-logs.model");
const ConnectPointLogs = require("./temp/connect-point-logs.model");

router.post("/beacon/register", authUser, registerBeacon);
// router.post("/beacon/user/register", authUser, registerBeaconUser);
router.post("/beacon/user/assign", authUser, assignBeaconUser);
router.get("/beacons", authUser, readAllBeacons);
// router.get("/beacon/users", authUser, readAllBeaconUsers);
router.post("/beacon/update/ack", authUser, updateBeaconUserAck);
// router.post("/beacon/update/lowBattery", authUser, updateBeaconBatteryLowFlag);
router.post("/beacon/update", updateBeacon);
router.delete("/beacon/delete/:id", authUser, deleteBeacon);
router.get("/beacon/sos/history", authUser, readAllSosHistory);
router.get("/beacon/sos/history/date", authUser, readSosHistoryOfDate);

// to be removed later
const fetchBeaconPath = async (req, res) => {
  try {
    const { date, bnid } = req.query;

    if (!date || !bnid) {
      return res.status(200).json([]);
    }

    const [log] = await PathLogs.find(
      { date, "bnids.bnid": bnid },
      { "bnids.$": 1 }
    );

    if (!log || log.bnids.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(log.bnids[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beacon history", error });
  }
};

router.get("/beacon/history", fetchBeaconPath);

// to be removed later

const fetchConnectPointLogs = async (req, res) => {
  try {
    const { date } = req.query;
    const [logs] = await ConnectPointLogs.find({ date });
    res.status(200).json(logs ? logs.cpids : []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beacon history", error });
  }
};

router.get("/connect-point/logs", fetchConnectPointLogs);

module.exports = router;
