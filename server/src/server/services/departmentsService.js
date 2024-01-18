const Department = require("../models/Department");
const User = require("../models/User");
const Device = require("../models/Device");

const createDepartment = async (name) => {
  const keys = { name };
  const department = new Department(keys);
  const newDepartment = await department.save();

  return newDepartment;
};

const readDepartments = async () => {
  const departments = await Department.find({}).populate("devices");
  return departments;
};

const deleteDepartment = async (_id) => {
  // Unallocate devices from this department
  const devices = await Device.find({ department: _id });
  console.log(devices);

  // Update the department field to null for all devices in this department
  await Promise.all(
    devices.map(async (device) => {
      device.department = null;
      await device.save();
    })
  );

  // Delete the department
  const { deletedCount } = await Department.deleteOne({ _id });
  return deletedCount;
};

const assignDepartmentDevices = async (departmentId, deviceIds) => {
  const allDevices = await Device.find({ department: departmentId });

  // Set department field to null in allDevices
  const bulkOperations = allDevices.map((device) => ({
    updateOne: {
      filter: { _id: device._id },
      update: { $unset: { department: "" } },
    },
  }));

  if (bulkOperations.length > 0) {
    await Device.bulkWrite(bulkOperations);
  }

  // Assign new devices to department
  const newDeviceIds = [];

  for (const deviceId of deviceIds) {
    const device = await Device.findOneAndUpdate(
      { deviceId: deviceId },
      { department: departmentId },
      { new: true }
    );

    if (device) {
      newDeviceIds.push(device._id);
    }
  }

  console.log(newDeviceIds);

  // Update department's devices
  const department = await Department.findByIdAndUpdate(
    departmentId,
    { devices: newDeviceIds },
    { new: true }
  );

  return department;
};

module.exports = {
  createDepartment,
  readDepartments,
  deleteDepartment,
  assignDepartmentDevices,
};

// const Department = require("../models/Department");
// const User = require("../models/User");

// const createDepartment = async (userId, departmentName, imagePath) => {
//   try {
//     // Find the user
//     const user = await User.findById(userId).populate("departments");

//     // Check if the department name is already present for the user
//     const departmentExists = user.departments.some(
//       (department) => department.name === departmentName
//     );
//     if (departmentExists) {
//       throw new Error("Department name already exists for the user.");
//     }

//     // Create the department
//     const department = await Department.create({
//       name: departmentName,
//       image: imagePath,
//       devices: [],
//     });

//     // Add the department to the user's departments array
//     user.departments.push(department._id);
//     await user.save();

//     // Return the created department
//     return department;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// const readDepartments = async (userId) => {
//   try {
//     // Find the user by ID and populate the departments field
//     const user = await User.findById(userId).populate("departments");

//     // Return the departments associated with the user
//     return user.departments;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// const addDevice = async (departmentId, deviceId, x, y) => {
//   try {
//     // Find the department by ID
//     const department = await Department.findById(departmentId);

//     // Check if the device already exists in the department
//     const deviceExists = department.devices.some(
//       (device) => device.device.toString() === deviceId
//     );
//     if (deviceExists) {
//       throw new Error("Device already exists in the department.");
//     }

//     // Create a new device object with its position
//     const newDevice = {
//       device: deviceId,
//       position: {
//         x: x,
//         y: y,
//       },
//     };

//     // Add the new device to the department's devices array
//     department.devices.push(newDevice);

//     // Save the department
//     await department.save();

//     // Return the updated department
//     return department;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// const removeDevice = async (departmentId, deviceId) => {
//   try {
//     // Find the department by ID
//     const department = await Department.findById(departmentId);

//     // Check if the device exists in the department
//     const deviceIndex = department.devices.findIndex(
//       (device) => device.device.toString() === deviceId
//     );
//     if (deviceIndex === -1) {
//       throw new Error("Device does not exist in the department.");
//     }

//     // Remove the device from the department's devices array
//     department.devices.splice(deviceIndex, 1);

//     // Save the department
//     await department.save();

//     // Return the updated department
//     return department;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// module.exports = {
//   createDepartment,
//   readDepartments,
//   addDevice,
//   removeDevice,
// };
