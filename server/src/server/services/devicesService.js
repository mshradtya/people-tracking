const Device = require("../models/Device");
const Department = require("../models/Department");
const User = require("../models/User");

const registerDevice = async (deviceData) => {
  const device = new Device(deviceData);
  const newDevice = await device.save();
  return newDevice;
};

const readAllDevices = async () => {
  const allDevices = await Device.find({})
    .populate("owner", "username")
    .populate("department");
  return allDevices;
};

const readUnallocatedDevices = async () => {
  const unallocatedDevices = await Device.find({ owner: null }).select(
    "deviceId"
  );
  const deviceIds = unallocatedDevices.map((device) => device.deviceId);
  return deviceIds;
};

const readDepartmentUnallocatedDevices = async () => {
  const unallocatedDevices = await Device.find({ department: null }).select(
    "deviceId"
  );
  // const unallocatedDevices = await Device.find({ department: "" });
  console.log(unallocatedDevices);
  const deviceIds = unallocatedDevices.map((device) => device.deviceId);
  return deviceIds;
};

const updateDevice = async (deviceData) => {
  const updatedDevice = await Device.findOneAndUpdate(
    { deviceId: deviceData.deviceId },
    deviceData,
    { new: true, runValidators: true }
  );
  return updatedDevice;
};

const deleteDevice = async (deviceId) => {
  // Find the device to get its department and user, and then remove it from their respective devices arrays
  const device = await Device.findOne({ _id: deviceId }).populate(
    "department owner"
  );

  console.log(device);

  if (!device) {
    throw new Error("Device not found.");
  }

  if (device.department && device.department._id) {
    const departmentId = device.department._id;
    await Department.updateOne(
      { _id: departmentId },
      { $pull: { devices: deviceId } }
    );
  }

  if (device.owner && device.owner._id) {
    const userId = device.owner._id;
    await User.updateOne({ _id: userId }, { $pull: { devices: deviceId } });
  }

  // Delete the device
  const { deletedCount } = await Device.deleteOne({
    _id: deviceId,
  });
  return deletedCount;
};

module.exports = {
  registerDevice,
  readAllDevices,
  readUnallocatedDevices,
  readDepartmentUnallocatedDevices,
  updateDevice,
  deleteDevice,
};
