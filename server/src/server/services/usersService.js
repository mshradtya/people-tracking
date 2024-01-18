const User = require("../models/User");
const Device = require("../models/Device");

const registerUser = async (userData) => {
  const user = new User(userData);
  const newUser = await user.save();
  return newUser;
};

const readAllUsers = async () => {
  const allUsers = await User.find({ role: "User" }, "-password").populate(
    "devices"
  );
  return allUsers;
};
const readUser = async (_id) => {
  const userDetail = await User.findById({ _id }, "-password");
  if (userDetail === null) {
    return null;
  }
  return userDetail;
};

const readUserDevices = async (_id) => {
  const user = await User.findById({ _id }).populate({
    path: "devices",
    populate: {
      path: "department",
      model: "Department",
    },
  });
  const devices = user.devices;
  return devices;
};

const updateUsername = async (_id, newUsername) => {
  const user = await User.findByIdAndUpdate(
    _id,
    { username: newUsername },
    { new: true, select: "-password -devices" }
  );
  return user;
};

const updateEmail = async (_id, newEmail) => {
  const user = await User.findByIdAndUpdate(
    _id,
    { email: newEmail },
    { new: true, select: "-password -devices" }
  );
  return user;
};

const updatePassword = async (_id, newPassword) => {
  const user = await User.findByIdAndUpdate(
    _id,
    { password: newPassword },
    { new: true, select: "-password -devices" }
  );
  return user;
};

const assignDevices = async (userId, deviceIds) => {
  const allDevices = await Device.find({ owner: userId });

  // Set owner field to null in allDevices
  const bulkOperations = allDevices.map((device) => ({
    updateOne: {
      filter: { _id: device._id },
      update: { $unset: { owner: "" } },
    },
  }));

  if (bulkOperations.length > 0) {
    await Device.bulkWrite(bulkOperations);
  }

  // Assign new devices to user
  const newDeviceIds = [];

  for (const deviceId of deviceIds) {
    const device = await Device.findOneAndUpdate(
      { deviceId: deviceId },
      { owner: userId },
      { new: true }
    );

    if (device) {
      newDeviceIds.push(device._id);
    }
  }

  // Update user's devices
  const user = await User.findByIdAndUpdate(
    userId,
    { devices: newDeviceIds },
    { new: true, select: "-password" }
  );

  return user;
};

const deleteUsers = async (userId) => {
  try {
    // Find the user to be deleted
    const user = await User.findById(userId);

    // Set owner field to null in allDevices
    const allDevices = await Device.find({ owner: userId });
    const bulkOperations = allDevices.map((device) => ({
      updateOne: {
        filter: { _id: device._id },
        update: { $set: { owner: null } },
      },
    }));

    if (bulkOperations.length > 0) {
      await Device.bulkWrite(bulkOperations);
    }

    // Delete the user
    const { deletedCount } = await User.deleteOne({ _id: userId });

    return deletedCount;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  registerUser,
  readAllUsers,
  readUser,
  updateUsername,
  updateEmail,
  updatePassword,
  assignDevices,
  deleteUsers,
  readUserDevices,
};
