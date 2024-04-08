const connectPointService = require("./connect-point.services");

const registerConnectPoint = async (req, res) => {
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
    !Object.keys(req.body).includes("cpid")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "connect point id is required",
    });
  }

  try {
    const { cpid } = req.body;
    const connectPointData = {
      cpid,
      gwid: null,
      coords: { x: null, y: null },
      roiCoords: [],
      sos: "L",
    };
    const connectPoint = await connectPointService.registerConnectPoint(
      connectPointData
    );
    res.status(201).json({ status: 201, success: true, connectPoint });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readAllConnectPoints = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin" && res.body.role !== "User") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }

  try {
    const allConnectPoints = await connectPointService.readAllConnectPoints();
    return res
      .status(200)
      .json({ status: 200, success: true, connectPoints: allConnectPoints });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const updateConnectPointCoords = async (req, res) => {
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
    Object.keys(req.body).length !== 3 ||
    !Object.keys(req.body).includes("cpid") ||
    !Object.keys(req.body).includes("coords") ||
    !Object.keys(req.body).includes("roiCoords")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "connect point id and coords is required",
    });
  }

  try {
    const { cpid, coords, roiCoords } = req.body;
    const updatedConnectPoint =
      await connectPointService.updateConnectPointCoords(
        cpid,
        coords,
        roiCoords
      );
    return res
      .status(200)
      .json({ status: 200, success: true, connectPoint: updatedConnectPoint });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const updateConnectPointRoiCoords = async (req, res) => {
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
    !Object.keys(req.body).includes("cpid") ||
    !Object.keys(req.body).includes("roiCoords")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "connect point id and roi coords is required",
    });
  }

  try {
    const { cpid, roiCoords } = req.body;
    const updatedConnectPoint =
      await connectPointService.updateConnectPointRoiCoords(cpid, roiCoords);
    return res
      .status(200)
      .json({ status: 200, success: true, connectPoints: updatedConnectPoint });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const connectPointSosStatus = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin" && res.body.role !== "User") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You must have SuperAdmin privilege to perform this operation",
    });
  }

  try {
    const sosConnectPoints = await connectPointService.connectPointSosStatus();
    return res.status(200).json({
      status: 200,
      success: true,
      connectPoints: sosConnectPoints,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

const deleteConnectPoint = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }

  try {
    const cpid = req.params.id;
    const deletedCount = await connectPointService.deleteConnectPoint(cpid);
    if (deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `Connect Point not found`,
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: `${deletedCount} connect point(s) have been deleted`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

module.exports = {
  registerConnectPoint,
  readAllConnectPoints,
  updateConnectPointCoords,
  updateConnectPointRoiCoords,
  connectPointSosStatus,
  deleteConnectPoint,
};
