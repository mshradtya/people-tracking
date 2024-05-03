const mongoose = require("mongoose");
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

    const beaconData = {
      bnid,
      gwid: null,
      cpid: null,
      sos: "L",
      idle: "L",
      userAck: false,
      timestamp: null,
      battery: 10,
      username: "none",
      reassigned: false,
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

const registerBeaconUser = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You must have SuperAdmin privilege to perform this operation",
    });
  }

  if (
    Object.keys(req.body).length !== 5 ||
    !(
      Object.keys(req.body).includes("name") &&
      Object.keys(req.body).includes("username") &&
      Object.keys(req.body).includes("designation") &&
      Object.keys(req.body).includes("email") &&
      Object.keys(req.body).includes("phone")
    )
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "name, username, designation, email and phone is required.",
    });
  }
  try {
    const { name, username, designation, email, phone } = req.body;

    const userData = {
      name,
      username,
      designation,
      email,
      phone,
      dateRegistered: formattedDate(new Date()),
    };
    const user = await beaconService.registerBeaconUser(userData);
    return res
      .status(201)
      .json({ status: 201, success: true, beaconUser: user });
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

const readAllBeaconUsers = async (req, res) => {
  if (res.body.role === "SuperAdmin" || res.body.role === "User") {
    const allUsers = await beaconService.readAllBeaconUsers();

    return res
      .status(200)
      .json({ status: 200, success: true, allBeaconUsers: allUsers });
  } else {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin or User privilege to perform this operation.`,
    });
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
    const { bnid, ack, sos } = req.query;
    const beacon = await beaconService.updateBeaconUserAck(bnid, ack, sos);
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
  if (req.query.BNID > 0) {
    if ("Location" in req.query) {
      const { Location, BNID, SOS, BATTERY } = req.query;
      try {
        const beacon = await beaconService.updateBeacon(
          Location,
          CPID,
          BNID,
          SOS,
          BATTERY
        );

        if (!beacon) {
          return res.status(201).json({
            status: 201,
            success: false,
            message: `beacon not registered`,
          });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ status: 400, success: false, message: error.message });
      }
    } else {
      const { GWID, CPID, BNID, SOS, IDLE, BATTERY } = req.query;

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
  registerBeaconUser,
  assignBeaconUser,
  readAllBeacons,
  readAllBeaconUsers,
  updateBeaconUserAck,
  updateBeacon,
  deleteBeacon,
  readAllSosHistory,
};
