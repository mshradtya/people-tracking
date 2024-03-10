const Gateway = require("../models/Gateway");
const Beacon = require("../models/Beacon");

const registerGateway = async (gatewayData) => {
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

const deleteGateway = async (gwid) => {
  const { deletedCount } = await Gateway.deleteOne({
    gwid,
  });
  return deletedCount;
};

module.exports = {
  registerGateway,
  readAllGateways,
  deleteGateway,
};
