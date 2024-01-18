const express = require("express");
const router = express.Router();
const {
  createDepartment,
  readDepartments,
  deleteDepartment,
  assignDepartmentDevices,
  addDevice,
  removeDevice,
} = require("../controllers/departmentsController");
const { authUser } = require("../controllers/authController");

router.post("/departments/create", authUser, createDepartment);
router.get("/departments", authUser, readDepartments);
router.post("/departments/delete/:id", authUser, deleteDepartment);
router.put("/departments/update/devices", authUser, assignDepartmentDevices);

// router.post("/departments/create/:id", authUser, createDepartment);
// router.get("/departments/list/:id", authUser, readDepartments);
// router.put("/department/add/device", authUser, addDevice);
// router.put("/department/remove/device", authUser, removeDevice);

module.exports = router;
