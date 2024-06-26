const Beacon = require("./beacon.model");
const Gateway = require("../gateway/gateway.model");
const ConnectPoint = require("../connect-point/connect-point.model");
const SosHistory = require("./beacon-sos-history.model");
const PathLogs = require("./temp/path-logs.model");
const ConnectPointLogs = require("./temp/connect-point-logs.model");
const { formattedDate, getMinutesDifference } = require("../../utils/helper");

const registerBeacon = async (beaconData) => {
  const beacon = new Beacon(beaconData);
  const newBeacon = await beacon.save();
  return newBeacon;
};

const assignBeaconUser = async (bnid, username) => {
  const words = username.split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  username = capitalizedWords.join(" ");

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

const readAllSosHistory = async () => {
  const allSosHistory = await SosHistory.find({}).sort({ _id: -1 });
  return allSosHistory;
};

const readSosHistoryOfDate = async (date, shift) => {
  if (date && shift) {
    const startDate = new Date(date);
    let startTime, endTime;

    if (shift === "fullDay") {
      startTime = new Date(startDate);
      startTime.setHours(6, 0, 0, 0);
      endTime = new Date(startDate);
      endTime.setDate(endTime.getDate() + 1);
      endTime.setHours(5, 59, 59, 999);
    } else if (shift === "shiftA") {
      startTime = new Date(startDate);
      startTime.setHours(6, 0, 0, 0);
      endTime = new Date(startDate);
      endTime.setHours(13, 59, 59, 999);
    } else if (shift === "shiftB") {
      startTime = new Date(startDate);
      startTime.setHours(14, 0, 0, 0);
      endTime = new Date(startDate);
      endTime.setHours(21, 59, 59, 999);
    } else if (shift === "shiftC") {
      startTime = new Date(startDate);
      startTime.setHours(22, 0, 0, 0);
      endTime = new Date(startDate);
      endTime.setDate(endTime.getDate() + 1);
      endTime.setHours(5, 59, 59, 999);
    }

    const sosHistoryOfDate = await SosHistory.find({
      timestamp: {
        $gte: startTime.toISOString(),
        $lt: endTime.toISOString(),
      },
    }).sort({ _id: -1 });

    return sosHistoryOfDate;
  } else {
    const allSosHistory = await SosHistory.find({}).sort({ _id: -1 });
    return allSosHistory;
  }
};

const updateBeaconUserAck = async (bnid, type) => {
  const lastPacketDateTime = formattedDate();
  let beacon;

  if (type === "sos") {
    beacon = await Beacon.findOneAndUpdate(
      { bnid },
      { isSosActive: false },
      { new: true, runValidators: true }
    );
  } else if (type === "idle") {
    beacon = await Beacon.findOneAndUpdate(
      { bnid },
      { isIdleActive: false },
      { new: true, runValidators: true }
    );
  } else if (type === "battery") {
    beacon = await Beacon.findOneAndUpdate(
      { bnid },
      { isBatteryLow: false, lowBattAckTime: lastPacketDateTime },
      { new: true, runValidators: true }
    );
  } else if (type === "dcs") {
    beacon = await Beacon.findOneAndUpdate(
      { bnid },
      { isInDcsRoom: false, isSosActive: false },
      { new: true, runValidators: true }
    );
  }

  return beacon;
};

const updateBeaconDCS = async (BNID, SOS, BATTERY) => {
  const updatedBeacon = await Beacon.findOneAndUpdate(
    { bnid: BNID },
    {
      isInDcsRoom: true,
      isSosActive: SOS === "H" ? true : false,
      battery: BATTERY,
    },
    { new: true, runValidators: true }
  );
  return updatedBeacon;
};

const updateGWCPHealth = async (GWID, CPID) => {
  const lastPacketDateTime = formattedDate();

  const updatedGateway = await Gateway.findOneAndUpdate(
    { gwid: GWID },
    { timestamp: lastPacketDateTime },
    { new: true, runValidators: true }
  );

  const updatedConnectPoint = await ConnectPoint.findOneAndUpdate(
    { cpid: CPID },
    { gwid: GWID, timestamp: lastPacketDateTime }
  );

  // to be removed later
  await saveConnectPointLogs(CPID, lastPacketDateTime);

  return { updatedGateway, updatedConnectPoint };
};

// to be removed later
const saveConnectPointLogs = async (CPID, lastPacketDateTime) => {
  const now = new Date();

  // Get the current time in milliseconds and add the IST offset (5 hours 30 minutes) in milliseconds
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  // Format the IST date to ISO string and extract the date part
  const today = istDate.toISOString().split("T")[0];

  let connectPointLog = await ConnectPointLogs.findOne({ date: today });

  if (connectPointLog) {
    // If there's a log for today, check if there's an entry for the CPID
    const cpidEntry = connectPointLog.cpids.find(
      (entry) => entry.cpid === CPID
    );
    if (cpidEntry) {
      // If there's an entry for the CPID, push the new timestamp
      cpidEntry.timestamps.push(
        `${lastPacketDateTime.split(" ")[1]} ${
          lastPacketDateTime.split(" ")[2]
        }`
      );
    } else {
      // If there's no entry for the CPID, create one
      connectPointLog.cpids.push({
        cpid: CPID,
        timestamps: [
          `${lastPacketDateTime.split(" ")[1]} ${
            lastPacketDateTime.split(" ")[2]
          }`,
        ],
      });
    }
  } else {
    // If there's no log for today, create a new one
    connectPointLog = new ConnectPointLogs({
      date: today,
      cpids: [
        {
          cpid: CPID,
          timestamps: [
            `${lastPacketDateTime.split(" ")[1]} ${
              lastPacketDateTime.split(" ")[2]
            }`,
          ],
        },
      ],
    });
  }

  await connectPointLog.save();
};

const updateBeacon = async (GWID, CPID, BNID, SOS, IDLE, BATTERY) => {
  const lastPacketDateTime = formattedDate();
  const beacon = await Beacon.findOne({ bnid: BNID });
  let updatedBeacon;

  if (beacon && !beacon.isSosActive && !beacon.isIdleActive) {
    let minutesDifference;
    if (beacon.lowBattAckTime) {
      minutesDifference = getMinutesDifference(beacon.lowBattAckTime);
    }
    updatedBeacon = await Beacon.findOneAndUpdate(
      { bnid: BNID },
      {
        isSosActive: SOS === "H" ? true : false,
        isIdleActive: IDLE === "H" ? true : false,
        battery: BATTERY,
        isBatteryLow: BATTERY < 30 && minutesDifference > 10 ? true : false,
        gwid: GWID,
        cpid: CPID,
        timestamp: lastPacketDateTime,
      },
      { new: true, runValidators: true }
    );

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
          timestamp: new Date().toISOString(),
          username: updatedBeacon.username,
        });
        await newSosHistory.save();
      } catch (err) {
        console.log(err);
      }
    }

    // to be remove later
    await logPath(BNID, CPID);
  }
  return updatedBeacon ? updatedBeacon : beacon;
};

// to be removed later
const lastReceivedTimes = {};

const formattedDate2 = () => {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return now.toLocaleString("en-US", options);
};

const logPath = async (BNID, CPID) => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  const today = istDate.toISOString().split("T")[0];

  const lastPacketDateTime = formattedDate2();
  const currentTime = new Date();

  let pathLog = await PathLogs.findOne({ date: today });

  if (!pathLog) {
    // If no path log exists for today, create a new one
    pathLog = new PathLogs({
      date: today,
      bnids: [],
    });
  }

  let bnidEntry = pathLog.bnids.find((entry) => entry.bnid === BNID);

  if (!bnidEntry) {
    // If no entry exists for the BNID, create a new one
    bnidEntry = {
      bnid: BNID,
      cpids: [],
    };
    pathLog.bnids.push(bnidEntry);
  }

  let createNewEntry = true;
  if (lastReceivedTimes[BNID]) {
    const timeDifference = (currentTime - lastReceivedTimes[BNID]) / 1000 / 60; // difference in minutes
    if (timeDifference <= 5) {
      // If received within 5 minutes, update the last CPID entry
      let lastCpidEntry = bnidEntry.cpids[bnidEntry.cpids.length - 1];
      if (lastCpidEntry) {
        // Update the endTime of the last CPID entry
        lastCpidEntry.endTime = lastPacketDateTime.split(", ")[1];
        // Check if the last CPID in the path array is different from the new CPID
        if (lastCpidEntry.path[lastCpidEntry.path.length - 1] !== CPID) {
          // Push the new CPID into the path array of the last CPID entry
          lastCpidEntry.path.push(CPID);
        }
        createNewEntry = false;
      }
    }
  }

  if (createNewEntry) {
    // If no recent data or no last entry, create a new entry
    bnidEntry.cpids.push({
      startTime: lastPacketDateTime.split(", ")[1],
      endTime: lastPacketDateTime.split(", ")[1],
      path: [CPID],
    });
  }

  // Update the last received time for the BNID
  lastReceivedTimes[BNID] = currentTime;

  await pathLog.save();
};

const deleteBeacon = async (bnid) => {
  const { deletedCount } = await Beacon.deleteOne({
    bnid,
  });
  return deletedCount;
};

module.exports = {
  registerBeacon,
  assignBeaconUser,
  readAllBeacons,
  updateBeaconUserAck,
  updateBeaconDCS,
  updateGWCPHealth,
  updateBeacon,
  deleteBeacon,
  readAllSosHistory,
  readSosHistoryOfDate,
};
