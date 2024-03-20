const Beacon = require("../models/Beacon");
const Gateway = require("../models/Gateway");
const ConnectPoint = require("../models/ConnectPoint");

const registerBeacon = async (beaconData) => {
  const beacon = new Beacon(beaconData);
  const newBeacon = await beacon.save();
  return newBeacon;
};

const readAllBeacons = async () => {
  const allBeacons = await Beacon.find({});
  return allBeacons;
};

const updateBeacon = async (GWID, CPID, BNID, SOS, BATTERY) => {
  const updatedBeacon = await Beacon.findOneAndUpdate(
    { bnid: BNID },
    { sos: SOS, battery: BATTERY, gwid: GWID, cpid: CPID },
    { new: true, runValidators: true }
  );

  await Gateway.findOneAndUpdate({ gwid: GWID }, { sos: SOS });

  await ConnectPoint.findOneAndUpdate({ cpid: CPID }, { gwid: GWID, sos: SOS });

  return updatedBeacon;
};

const deleteGateway = async (gwid) => {
  const { deletedCount } = await Gateway.deleteOne({
    gwid,
  });
  return deletedCount;
};

module.exports = {
  registerBeacon,
  readAllBeacons,
  updateBeacon,
  deleteGateway,
};
