const express = require("express");
const router = express.Router();
const {
  registerGateway,
  readAllGateways,
  updateGatewayCoords,
  updateGatewayRoiCoords,
  gatewaysNotWorking,
  deleteGateway,
  gatewaySosStatus,
} = require("./gateway.controllers");
const { authUser } = require("../auth/auth.controllers");

router.post("/gateway/register", authUser, registerGateway);
router.get("/gateways", authUser, readAllGateways);
router.delete("/gateway/delete/:id", authUser, deleteGateway);
router.get("/gateways/not-working", authUser, gatewaysNotWorking);

// map
router.post("/gateway/update/coords", authUser, updateGatewayCoords);
router.post("/gateway/update/roiCoords", authUser, updateGatewayRoiCoords);
router.get("/gateway/sos", authUser, gatewaySosStatus);

module.exports = router;
