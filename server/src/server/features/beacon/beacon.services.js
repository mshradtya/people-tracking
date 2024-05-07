const Beacon = require("./beacon.model");
const Gateway = require("../gateway/gateway.model");
const ConnectPoint = require("../connect-point/connect-point.model");
const BeaconUser = require("./beacon-user.model");
const SosHistory = require("./beacon-sos-history.model");
const { formattedDate } = require("../../utils/helper");
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

const readAllSosHistory = async () => {
  const allSosHistory = await SosHistory.find({}).sort({ _id: -1 });
  return allSosHistory;
};

const updateBeaconUserAck = async (bnid, ack, sos) => {
  const beacon = await Beacon.findOneAndUpdate(
    { bnid },
    { userAck: ack, sos },
    { new: true, runValidators: true }
  );
  return beacon;
};

const updateBeaconIsInDcsFlag = async (bnid) => {
  const beacon = await Beacon.findOneAndUpdate(
    { bnid },
    { isInDcsRoom: false },
    { new: true, runValidators: true }
  );
  return beacon;
};

const updateBeaconDCS = async (BNID, SOS, BATTERY) => {
  const lastPacketDateTime = formattedDate();

  const updatedBeacon = await Beacon.findOneAndUpdate(
    { bnid: BNID },
    {
      isInDcsRoom: true,
      sos: SOS,
      battery: BATTERY,
      timestamp: lastPacketDateTime,
    },
    { new: true, runValidators: true }
  );
  return updatedBeacon;
};

const updateBeacon = async (GWID, CPID, BNID, SOS, IDLE, BATTERY) => {
  const now = new Date();
  const lastPacketDateTime = formattedDate();

  // Check if there's a recent request with the same BNID
  const recentRequest = recentRequests.get(BNID);
  if (recentRequest) {
    // If there's a recent request, check if the SOS value is different
    const timeDiff = now - recentRequest.timestamp;
    if (timeDiff < 10000 && recentRequest.sos === SOS) {
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

  const beacon = await Beacon.findOne({ bnid: BNID });
  let updatedBeacon;

  if (beacon) {
    updatedBeacon = await Beacon.findOneAndUpdate(
      { bnid: BNID },
      {
        sos: !beacon.userAck ? SOS : "H",
        idle: IDLE,
        battery: BATTERY,
        gwid: GWID,
        cpid: CPID,

        timestamp: lastPacketDateTime,
      },
      { new: true, runValidators: true }
    );
  }

  const updatedGateway = await Gateway.findOneAndUpdate(
    { gwid: GWID },
    { sos: SOS, timestamp: lastPacketDateTime },
    { new: true, runValidators: true }
  );

  await ConnectPoint.findOneAndUpdate(
    { cpid: CPID },
    { gwid: GWID, sos: SOS, timestamp: lastPacketDateTime }
  );

  if (SOS === "H" || IDLE === "H") {
    try {
      const newSosHistory = new SosHistory({
        bnid: BNID,
        gwid: GWID,
        cpid: CPID,
        type: SOS === "H" ? "SOS" : "IDLE DETECTION",
        location: updatedGateway.location,
        timestamp: lastPacketDateTime,
        username: updatedBeacon.username,
      });
      await newSosHistory.save();
    } catch (err) {
      console.log(err);
    }
  }

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
  updateBeaconUserAck,
  updateBeaconIsInDcsFlag,
  updateBeaconDCS,
  updateBeacon,
  deleteBeacon,
  readAllSosHistory,
};
