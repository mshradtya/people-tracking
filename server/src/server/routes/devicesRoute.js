const express = require("express");
const router = express.Router();
const {
  registerDevice,
  readAllDevices,
  readUnallocatedDevices,
  readDepartmentUnallocatedDevices,
  updateDevice,
  deleteDevice,
} = require("../controllers/devicesController");
const { authUser } = require("../controllers/authController");

router.post("/device/register", authUser, registerDevice);
router.post("/device/delete/:id", authUser, deleteDevice);
router.get("/devices", authUser, readAllDevices);
router.get("/devices/unallocated", authUser, readUnallocatedDevices);
router.get(
  "/departments/devices/unallocated",
  authUser,
  readDepartmentUnallocatedDevices
);

router.put("/device/update/", updateDevice);

module.exports = router;
