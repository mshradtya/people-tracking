const Gateway = require("../models/Gateway");

const registerGateway = async (gatewayData) => {
  const gateway = new Gateway(gatewayData);
  const newGateway = await gateway.save();
  return newGateway;
};

const readAllGateways = async () => {
  const allGateways = await Gateway.find({});
  // .populate("owner", "username")
  // .populate("department");
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
