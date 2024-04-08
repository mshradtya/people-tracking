const Beacon = require("./beacon.model");
const Gateway = require("../gateway/gateway.model");
const ConnectPoint = require("../connect-point/connect-point.model");
const BeaconUser = require("./beacon-user.model");
const recentRequests = new Map();

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

  for (let i = 0; i < allBeacons.length; i++) {
    const beacon = allBeacons[i];

    if (beacon.cpid) {
      const connectPoint = await ConnectPoint.findOne({ cpid: beacon.cpid });
      if (connectPoint && connectPoint.roiCoords) {
        beacon.boundingBox = connectPoint.roiCoords;
      }
    }
  }

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

  // Check if there's a recent request with the same BNID
  const recentRequest = recentRequests.get(BNID);
  if (recentRequest) {
    // If there's a recent request, check if the SOS value is different
    const timeDiff = now - recentRequest.timestamp;
    if (timeDiff < 5000 && recentRequest.sos === SOS) {
      // If the SOS value is the same and the request is within the last 5 seconds, ignore the current request
      return null;
    }
    // Update the recent request with the new SOS value and timestamp
    recentRequest.sos = SOS;
    recentRequest.timestamp = now;
  } else {
    // If there's no recent request, add a new entry in the recentRequests Map
    recentRequests.set(BNID, { sos: SOS, timestamp: now });
  }

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

const deleteBeacon = async (bnid) => {
  const { deletedCount } = await Beacon.deleteOne({
    bnid,
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
  deleteBeacon,
};
