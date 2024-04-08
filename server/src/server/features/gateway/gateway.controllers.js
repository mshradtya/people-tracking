const gatewayService = require("./gateway.services");

const registerGateway = async (req, res) => {
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
    !Object.keys(req.body).includes("gwid") ||
    !Object.keys(req.body).includes("location")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "gateway id and location is required",
    });
  }

  try {
    const { gwid, location } = req.body;
    const gatewayData = {
      gwid,
      location,
      coords: { x: null, y: null },
      roiCoords: [],
      sos: "L",
    };
    const gateway = await gatewayService.registerGateway(gatewayData);
    res.status(201).json({ status: 201, success: true, gateway });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readAllGateways = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin" && res.body.role !== "User") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin or User privilege to perform this operation.`,
    });
  }

  try {
    const allGateways = await gatewayService.readAllGateways();
    return res
      .status(200)
      .json({ status: 200, success: true, gateways: allGateways });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const updateGatewayCoords = async (req, res) => {
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
    !Object.keys(req.body).includes("gwid") ||
    !Object.keys(req.body).includes("coords")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "gateway id and coords is required",
    });
  }

  try {
    const { gwid, coords } = req.body;
    const updatedGateway = await gatewayService.updateGatewayCoords(
      gwid,
      coords
    );
    return res
      .status(200)
      .json({ status: 200, success: true, gateways: updatedGateway });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const updateGatewayRoiCoords = async (req, res) => {
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
    !Object.keys(req.body).includes("gwid") ||
    !Object.keys(req.body).includes("roiCoords")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "gateway id and roi coords is required",
    });
  }

  try {
    const { gwid, roiCoords } = req.body;
    const updatedGateway = await gatewayService.updateGatewayRoiCoords(
      gwid,
      roiCoords
    );
    return res
      .status(200)
      .json({ status: 200, success: true, gateways: updatedGateway });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const gatewaySosStatus = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin" && res.body.role !== "User") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You must have SuperAdmin privilege to perform this operation",
    });
  }

  try {
    const sosGateways = await gatewayService.gatewaySosStatus();
    return res.status(200).json({
      status: 200,
      success: true,
      gateways: sosGateways,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
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
  registerGateway,
  readAllGateways,
  updateGatewayCoords,
  updateGatewayRoiCoords,
  gatewaySosStatus,
  deleteGateway,
};
