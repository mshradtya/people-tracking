const Beacon = require("../models/Beacon");
const Gateway = require("../models/Gateway");
const ConnectPoint = require("../models/ConnectPoint");
const BeaconUser = require("../models/BeaconUser");

const registerBeacon = async (beaconData) => {
  const beacon = new Beacon(beaconData);
  const newBeacon = await beacon.save();
  return newBeacon;
};

const registerBeaconUser = async (userData) => {
  const user = new BeaconUser(userData);
  const newBeaconUser = await user.save();
  return newBeaconUser;
};

const assignBeaconUser = async (bnid, username) => {
  const beacon = await Beacon.findOneAndUpdate(
    { bnid },
    { username },
    { new: true }
  );
  return beacon;
};

const readAllBeacons = async () => {
  const allBeacons = await Beacon.find({});
  return allBeacons;
};

const readAllBeaconUsers = async () => {
  const allUsers = await BeaconUser.find({});
  return allUsers;
};

const updateBeacon = async (GWID, CPID, BNID, SOS, BATTERY) => {
  const now = new Date();
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const updatedBeacon = await Beacon.findOneAndUpdate(
    { bnid: BNID },
    {
      sos: SOS,
      battery: BATTERY,
      gwid: GWID,
      cpid: CPID,
      timestamp: now.toLocaleString("en-US", options),
    },
    { new: true, runValidators: true }
  );

  await Gateway.findOneAndUpdate(
    { gwid: GWID },
    { sos: SOS, timestamp: now.toLocaleString("en-US", options) }
  );

  await ConnectPoint.findOneAndUpdate(
    { cpid: CPID },
    { gwid: GWID, sos: SOS, timestamp: now.toLocaleString("en-US", options) }
  );

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
  registerBeaconUser,
  assignBeaconUser,
  readAllBeacons,
  readAllBeaconUsers,
  updateBeacon,
  deleteGateway,
};
