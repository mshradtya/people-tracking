const Gateway = require("./gateway.model");
const { getMinutesDifference } = require("../../utils/helper");

const registerGateway = async (gatewayData) => {
  const gateway = new Gateway(gatewayData);
  const newGateway = await gateway.save();
  return newGateway;
};

const gatewaysNotWorking = async () => {
  const allGateways = await Gateway.find({});
  let notWorkingGateways = [];

  for (const gateway of allGateways) {
    const timeDifference = getMinutesDifference(gateway.timestamp);
    if (timeDifference > 30) {
      notWorkingGateways.push(gateway.gwid);
    }
  }

  return notWorkingGateways;
};

const readAllGateways = async () => {
  const allGateways = await Gateway.find({});

  return allGateways;
};

const updateGatewayCoords = async (gwid, coords) => {
  const filter = { gwid };
  const update = { coords };
  const options = { new: true };

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
  gatewaysNotWorking,
  updateGatewayCoords,
  updateGatewayRoiCoords,
  gatewaySosStatus,
  deleteGateway,
};
