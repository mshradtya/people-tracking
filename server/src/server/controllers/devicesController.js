const devicesService = require("../services/devicesService");
// const { formattedDate, lastPacketFormattedDate } = require("../utils/helper");

const registerDevice = async (req, res) => {
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
    !Object.keys(req.body).includes("deviceId")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "deviceId is required",
    });
  }

  try {
    const { deviceId } = req.body;
    const deviceData = {
      deviceId,
      status: 0,
      refilledDate: null,
      expiryDate: null,
      empId: null,
      location: null,
      onDate: null,
      onTime: null,
      battery: null,
      networkStrength: null,
      owner: null,
      department: null,
    };
    const device = await devicesService.registerDevice(deviceData);
    res.status(201).json({ status: 201, success: true, device });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readAllDevices = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }

  try {
    const allDevices = await devicesService.readAllDevices();
    return res
      .status(200)
      .json({ status: 200, success: true, devices: allDevices });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readUnallocatedDevices = async (req, res) => {
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }

  try {
    const allDevices = await devicesService.readUnallocatedDevices();
    return res
      .status(200)
      .json({ status: 200, success: true, devices: allDevices });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readDepartmentUnallocatedDevices = async (req, res) => {
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }

  try {
    const allDevices = await devicesService.readDepartmentUnallocatedDevices();
    return res
      .status(200)
      .json({ status: 200, success: true, devices: allDevices });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const updateDevice = async (req, res) => {
  const deviceData = {
    deviceId: req.query.f1,
    status: req.query.f2,
    refilledDate: req.query.f3,
    expiryDate: req.query.f4,
    empId: req.query.f5,
    location: req.query.f6,
    onDate: req.query.f7,
    onTime: req.query.f8,
    battery: req.query.f9,
    networkStrength: req.query.f10,
  };

  for (const field in deviceData) {
    if (!deviceData[field]) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `${field} is required`,
      });
    }
  }

  try {
    const device = await devicesService.updateDevice(deviceData);
    if (!device) {
      return res.status(201).json({
        status: 201,
        success: false,
        message: `device not registered`,
      });
    }
    res.status(201).json({ status: 201, success: true, device });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const deleteDevice = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }

  try {
    const deviceId = req.params.id;
    const deletedCount = await devicesService.deleteDevice(deviceId);
    if (deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `Device not found`,
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: `${deletedCount} device(s) have been deleted`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

module.exports = {
  registerDevice,
  readAllDevices,
  readUnallocatedDevices,
  readDepartmentUnallocatedDevices,
  updateDevice,
  deleteDevice,
};
