const express = require("express");
const router = express.Router();
const {
  registerGateway,
  readAllGateways,
  deleteGateway,
} = require("../controllers/gatewayController");
const { authUser } = require("../controllers/authController");

router.post("/gateway/register", authUser, registerGateway);
router.get("/gateways", authUser, readAllGateways);
router.delete("/gateway/delete/:id", authUser, deleteGateway);

module.exports = router;
