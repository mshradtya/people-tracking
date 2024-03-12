const express = require("express");
const router = express.Router();
const {
  registerGateway,
  readAllGateways,
  updateGatewayCoords,
  updateGatewayRoiCoords,
  deleteGateway,
  gatewaySosStatus,
} = require("../controllers/gatewayController");
const { authUser } = require("../controllers/authController");

router.post("/gateway/register", authUser, registerGateway);
router.get("/gateways", authUser, readAllGateways);
router.delete("/gateway/delete/:id", authUser, deleteGateway);

// map
router.post("/gateway/update/coords", authUser, updateGatewayCoords);
router.post("/gateway/update/roiCoords", authUser, updateGatewayRoiCoords);
router.get("/gateway/sos", authUser, gatewaySosStatus);

module.exports = router;
