var UserModel = require("../models/User");
const { formattedDate } = require("./helper");

// Check if admin user exists, and create admin if not
const createAdmin = async () => {
  try {
    const admin = await UserModel.findOne({ username: "docketrun" });

    if (!admin) {
      const adminData = new UserModel({
        name: "DocketRun",
        username: "docketrun",
        email: "admin@docketrun.com",
        password: "DocketRun@123",
        role: "SuperAdmin",
        dateRegistered: formattedDate(new Date()),
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
