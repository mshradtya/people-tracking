const User = require("./user.model");

const registerUser = async (userData) => {
  const user = new User(userData);
  const newUser = await user.save();
  return newUser;
};

const readAllUsers = async () => {
  const allUsers = await User.find({}, "-password");
  return allUsers;
};

const readUser = async (_id) => {
  const userDetail = await User.findById({ _id }, "-password");
  if (userDetail === null) {
    return null;
  }
  return userDetail;
};

const updateUsername = async (_id, newUsername) => {
  const user = await User.findByIdAndUpdate(
    _id,
    { username: newUsername },
    { new: true, select: "-password" }
  );
  return user;
};

const updateEmail = async (_id, newEmail) => {
  const user = await User.findByIdAndUpdate(
    _id,
    { email: newEmail },
    { new: true, select: "-password" }
  );
  return user;
};

const updatePassword = async (_id, newPassword) => {
  const user = await User.findByIdAndUpdate(
    _id,
    { password: newPassword },
    { new: true, select: "-password" }
  );
  return user;
};

const deleteUsers = async (userId) => {
  try {
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
  deleteUsers,
};
