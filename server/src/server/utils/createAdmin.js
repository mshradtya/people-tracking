var UserModel = require("../models/User");
var BeaconUser = require("../models/BeaconUser");
const { formattedDate } = require("./helper");

// Check if admin user exists, and create admin if not
const createAdmin = async () => {
  try {
    const admin = await UserModel.findOne({ username: "docketrun" });
    const beaconUser = await BeaconUser.findOne({ username: "none" });

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

    if (!beaconUser) {
      const userData = new BeaconUser({
        username: "none",
        name: "None",
        designation: "none",
        email: "none@none.com",
        phone: null,
        dateRegistered: formattedDate(new Date()),
      });

      await userData.save();
      console.log("default beacon user created");
    }
  } catch (err) {
    console.log("Error creating admin:", err);
  }
};

module.exports = createAdmin;
