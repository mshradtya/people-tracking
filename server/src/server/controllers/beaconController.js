const mongoose = require("mongoose");
const beaconService = require("../services/beaconService");

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
    Object.keys(req.body).length !== 2 ||
    !Object.keys(req.body).includes("bnid") ||
    !Object.keys(req.body).includes("gateway")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "beacon and gateway id is required",
    });
  }

  try {
    const { bnid, gateway } = req.body;

    // Check if the provided gateway is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(gateway)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid gateway ObjectId",
      });
    }

    const beaconData = {
      bnid,
      gateway,
      sos: "L",
      battery: 10,
    };
    const beacon = await beaconService.registerBeacon(beaconData);
    res.status(201).json({ status: 201, success: true, beacon });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readAllBeacons = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
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

const updateBeacon = async (req, res) => {
  const { BNID, SOS, BATTERY } = req.query;

  try {
    const beacon = await beaconService.updateBeacon(BNID, SOS, BATTERY);
    if (!beacon) {
      return res.status(201).json({
        status: 201,
        success: false,
        message: `beacon not registered`,
      });
    }
    res.status(201).json({ status: 201, success: true, beacon });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const deleteGateway = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }

  try {
    const gwid = req.params.id;
    const deletedCount = await gatewayService.deleteGateway(gwid);
    if (deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `Gateway not found`,
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: `${deletedCount} gateway(s) have been deleted`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

module.exports = {
  registerBeacon,
  readAllBeacons,
  updateBeacon,
  deleteGateway,
};
