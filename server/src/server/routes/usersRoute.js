const express = require("express");
const router = express.Router();
const {
  registerUser,
  readAllUsers,
  readUser,
  updateUsername,
  updateEmail,
  updatePassword,
  assignDevices,
  deleteUsers,
  readUserDevices,
} = require("../controllers/usersController");
const {
  loginUser,
  authUser,
  refresh,
  logout,
} = require("../controllers/authController");

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/refresh", refresh);
router.post("/auth/logout", logout);
router.post("/users/delete/:id", authUser, deleteUsers);

router.get("/users", authUser, readAllUsers);
router.get("/user/:id", authUser, readUser);
router.get("/user/devices/:id", authUser, readUserDevices);

router.put("/user/update/username/:id", authUser, updateUsername);
router.put("/user/update/email/:id", authUser, updateEmail);
router.put("/user/update/password/:id", authUser, updatePassword);
router.put("/user/update/devices", authUser, assignDevices);

module.exports = router;
