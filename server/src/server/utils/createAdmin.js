var UserModel = require("../models/User");
const { formattedDate } = require("./helper");

// Check if admin user exists, and create admin if not
const createAdmin = async () => {
  try {
    const admin = await UserModel.findOne({ username: "admin" });

    if (!admin) {
      const adminData = new UserModel({
        username: "admin",
        email: "admin@gmail.com",
        password: "Adm1n!123",
        role: "SuperAdmin",
        dateRegistered: formattedDate(new Date()),
        devices: [],
      });

      await adminData.save();
      console.log("admin created");
    } else {
      console.log("admin exists");
    }
  } catch (err) {
    console.log("Error creating admin:", err);
  }
};

module.exports = createAdmin;
