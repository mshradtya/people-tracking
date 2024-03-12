const Gateway = require("../models/Gateway");
const Beacon = require("../models/Beacon");

const registerGateway = async (gatewayData) => {
  console.log(gatewayData);
  const gateway = new Gateway(gatewayData);
  const newGateway = await gateway.save();
  return newGateway;
};

const readAllGateways = async () => {
  const allGateways = await Gateway.find({});

  // Populate the "beacons" field for each gateway
  await Promise.all(
    allGateways.map(async (gateway) => {
      gateway.beacons = await Beacon.find({ gateway: gateway._id }).select(
        "-gateway -sos -battery"
      );
    })
  );

  return allGateways;
};

const updateGatewayCoords = async (gwid, coords) => {
  // Specify the conditions for the update
  const filter = { gwid };

  // Specify the new values you want to set
  const update = { coords };

  // Use the { new: true } option to return the updated document
  const options = { new: true };

  // Perform the update
  const updatedGateway = await Gateway.findOneAndUpdate(
    filter,
    update,
    options
  );

  return updatedGateway;
};

const updateGatewayRoiCoords = async (gwid, roiCoords) => {
  const filter = { gwid };
  const update = { roiCoords };
  const options = { new: true };

  // Perform the update
  const updatedGateway = await Gateway.findOneAndUpdate(
    filter,
    update,
    options
  );

  return updatedGateway;
};

const gatewaySosStatus = async () => {
  const gatewaysWithSos = await Gateway.find({ sos: "H" }, "gwid");
  const gwidList = gatewaysWithSos.map((gateway) => gateway.gwid);
  return gwidList;
};

const deleteGateway = async (gwid) => {
  const { deletedCount } = await Gateway.deleteOne({
    gwid,
  });
  return deletedCount;
};

module.exports = {
  registerGateway,
  readAllGateways,
  updateGatewayCoords,
  updateGatewayRoiCoords,
  gatewaySosStatus,
  deleteGateway,
};
