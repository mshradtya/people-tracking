const beaconService = require("./beacon.services");
const { formattedDate } = require("../../utils/helper");

const registerBeacon = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You must have SuperAdmin privilege to perform this operation",
    });
  }

  // Validate request body
  if (
    Object.keys(req.body).length !== 1 ||
    !Object.keys(req.body).includes("bnid")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "beacon id is required",
    });
  }

  try {
    const { bnid } = req.body;
    const lastPacketDateTime = formattedDate();

    const beaconData = {
      bnid,
      gwid: null,
      cpid: null,
      isSosActive: false,
      isIdleActive: false,
      isInDcsRoom: false,
      battery: 35,
      isBatteryLow: false,
      lowBattAckTime: lastPacketDateTime,
      timestamp: lastPacketDateTime,
      username: "",
      boundingBox: [],
    };
    const beacon = await beaconService.registerBeacon(beaconData);
    res.status(201).json({ status: 201, success: true, beacon });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const assignBeaconUser = async (req, res) => {
  // Validate request body
  if (
    Object.keys(req.body).length !== 2 ||
    !Object.keys(req.body).includes("bnid") ||
    !Object.keys(req.body).includes("username")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "beacon id and username is required",
    });
  }

  try {
    const { bnid, username } = req.body;

    const beacon = await beaconService.assignBeaconUser(bnid, username);
    res.status(200).json({ status: 200, success: true, beacon });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readAllBeacons = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin" && res.body.role !== "User") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin or User privilege to perform this operation.`,
    });
  }

  try {
    const allBeacons = await beaconService.readAllBeacons();
    return res
      .status(200)
      .json({ status: 200, success: true, beacons: allBeacons });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readSosHistoryOfDate = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin" && res.body.role !== "User") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin or User privilege to perform this operation.`,
    });
  }

  try {
    const { date } = req.query;
    const history = await beaconService.readSosHistoryOfDate(date);
    return res.status(200).json({ status: 200, success: true, history });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readAllSosHistory = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin" && res.body.role !== "User") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin or User privilege to perform this operation.`,
    });
  }

  try {
    const allSosHistory = await beaconService.readAllSosHistory();
    return res
      .status(200)
      .json({ status: 200, success: true, history: allSosHistory });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const updateBeaconUserAck = async (req, res) => {
  if (res.body.role !== "SuperAdmin" && res.body.role !== "User") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin or User privilege to perform this operation.`,
    });
  }

  try {
    const { bnid, type } = req.query;
    const beacon = await beaconService.updateBeaconUserAck(bnid, type);
    if (!beacon) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `beacon not registered`,
      });
    }
    res.status(201).json({ status: 200, success: true, beacon });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

const updateBeacon = async (req, res) => {
  if (req.query.BNID > 0 || req.query.GWID > 0 || req.query.CPID > 0) {
    // updating beacon battery and sos when beacon is in DCS room
    if (
      "LOCATION" in req.query &&
      "BNID" in req.query &&
      "SOS" in req.query &&
      "BATTERY" in req.query
    ) {
      const { BNID, SOS, BATTERY } = req.query;
      try {
        const beacon = await beaconService.updateBeaconDCS(BNID, SOS, BATTERY);

        if (!beacon) {
          return res.status(201).json({
            status: 201,
            success: false,
            message: `no beacon found`,
          });
        }
        res.status(200).json({ status: 200, success: true, beacon });
      } catch (error) {
        return res
          .status(500)
          .json({ status: 400, success: false, message: error.message });
      }
    }
    // handling data coming every 30 minutes if a Connect Point is inactive to signify that it's still healthy
    else if (
      parseInt(req.query.GWID) > 0 &&
      parseInt(req.query.CPID) > 0 &&
      parseInt(req.query.BNID) === 0
    ) {
      const { GWID, CPID } = req.query;

      try {
        const { updatedGateway, updatedConnectPoint } =
          await beaconService.updateGWCPHealth(GWID, CPID);

        if (!updatedGateway || !updatedConnectPoint) {
          return res.status(201).json({
            status: 201,
            success: false,
            message: `gateway or connect point not found`,
          });
        }
        res.status(200).json({
          status: 200,
          success: true,
          devices: [updatedGateway, updatedConnectPoint],
        });
      } catch (error) {
        return res
          .status(500)
          .json({ status: 400, success: false, message: error.message });
      }
    } // updating the isInDcsRoom flag triggered by closing the popup in frontend
    else if ("LOCATION" in req.query && "BNID" in req.query) {
      const { BNID } = req.query;
      try {
        const beacon = await beaconService.updateBeaconIsInDcsFlag(BNID);

        if (!beacon) {
          return res.status(201).json({
            status: 400,
            success: false,
            message: `no beacon found`,
          });
        }
        res.status(200).json({ status: 200, success: true, beacon });
      } catch (error) {
        return res
          .status(500)
          .json({ status: 400, success: false, message: error.message });
      }

      // updating the beacon data coming from the devices
    } else {
      const { GWID, CPID, BNID, SOS, IDLE, BATTERY } = req.query;

      // for dealing with the ghost beacon
      if (BNID === "1" && BATTERY == "8") {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "ghost beacon ignored",
        });
      } else {
        try {
          const beacon = await beaconService.updateBeacon(
            GWID,
            CPID,
            BNID,
            SOS,
            IDLE,
            BATTERY
          );
          if (!beacon) {
            return res.status(400).json({
              status: 400,
              success: false,
              message: `beacon not registered`,
            });
          }
          res.status(200).json({ status: 201, success: true, beacon });
        } catch (error) {
          return res
            .status(500)
            .json({ status: 400, success: false, message: error.message });
        }
      }
    }
  } else {
    return res
      .status(400)
      .json({ status: 400, success: false, message: "invalid bnid" });
  }
};

const deleteBeacon = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }

  try {
    const bnid = req.params.id;
    const deletedCount = await beaconService.deleteBeacon(bnid);
    if (deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `Beacon not found`,
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: `${deletedCount} beacon(s) have been deleted`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

module.exports = {
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
};
