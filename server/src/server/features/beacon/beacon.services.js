const Beacon = require("./beacon.model");
const Gateway = require("../gateway/gateway.model");
const ConnectPoint = require("../connect-point/connect-point.model");
const SosHistory = require("./beacon-sos-history.model");
const BeaconHistory = require("./temp/beacon-history.model");
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

const readSosHistoryOfDate = async (date) => {
  if (date) {
    // Parse the input date (YYYY-MM-DD) to the desired format (DD/MM/YY)
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}/${month}/${year.slice(2)}`; // Format to DD/MM/YY

    // Create a regular expression to match the date in the timestamp field
    const dateRegex = new RegExp(`^${formattedDate.replace(/\//g, "\\/")},`);

    // Query the database for matching timestamps
    const sosHistoryOfDate = await SosHistory.find({
      timestamp: { $regex: dateRegex, $options: "i" }, // Case insensitive match
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
  }

  return beacon;
};

const updateBeaconIsInDcsFlag = async (bnid) => {
  const beacon = await Beacon.findOneAndUpdate(
    { bnid },
    { isInDcsRoom: false, sos: "L", idle: "L" },
    { new: true, runValidators: true }
  );
  return beacon;
};

const updateBeaconDCS = async (BNID, SOS, BATTERY) => {
  const updatedBeacon = await Beacon.findOneAndUpdate(
    { bnid: BNID },
    {
      isInDcsRoom: true,
      sos: SOS,
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
        isBatteryLow: BATTERY < 30 && minutesDifference > 1 ? true : false,
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
          timestamp: lastPacketDateTime,
          username: updatedBeacon.username,
        });
        await newSosHistory.save();
      } catch (err) {
        console.log(err);
      }
    }

    // to be remove later
    await saveBeaconHistory(BNID, CPID);
  }
  return updatedBeacon ? updatedBeacon : beacon;
};

// to be removed later
// Timer logic for beacon history
let timers = {};

const saveBeaconHistory = async (BNID, CPID) => {
  const now = new Date();

  // Get the current time in milliseconds and add the IST offset (5 hours 30 minutes) in milliseconds
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  // Format the IST date to ISO string and extract the date part
  const today = istDate.toISOString().split("T")[0];

  const beaconHistory = await BeaconHistory.findOne({ date: today });

  if (beaconHistory) {
    const bnidEntry = beaconHistory.bnids.find((entry) => entry.bnid === BNID);
    if (bnidEntry) {
      if (bnidEntry.cpids.length > 0) {
        const lastCpid = bnidEntry.cpids[bnidEntry.cpids.length - 1];
        const lastEndTime = new Date(lastCpid.endTime);
        if (now - lastEndTime > 5 * 60 * 1000) {
          bnidEntry.cpids.push({
            startTime: istDate.toISOString(),
            endTime: istDate.toISOString(),
            path: [CPID],
          });
        } else {
          lastCpid.endTime = istDate.toISOString();
          lastCpid.path.push(CPID);
        }
      } else {
        bnidEntry.cpids.push({
          startTime: istDate.toISOString(),
          endTime: istDate.toISOString(),
          path: [CPID],
        });
      }
    } else {
      beaconHistory.bnids.push({
        bnid: BNID,
        cpids: [
          {
            startTime: istDate.toISOString(),
            endTime: istDate.toISOString(),
            path: [CPID],
          },
        ],
      });
    }
    await beaconHistory.save();
  } else {
    const newBeaconHistory = new BeaconHistory({
      date: today,
      bnids: [
        {
          bnid: BNID,
          cpids: [
            {
              startTime: istDate.toISOString(),
              endTime: istDate.toISOString(),
              path: [CPID],
            },
          ],
        },
      ],
    });
    await newBeaconHistory.save();
  }

  if (timers[BNID]) {
    clearTimeout(timers[BNID]);
  }

  timers[BNID] = setTimeout(async () => {
    const updatedBeaconHistory = await BeaconHistory.findOne({ date: today });
    const updatedBnidEntry = updatedBeaconHistory.bnids.find(
      (entry) => entry.bnid === BNID
    );

    if (updatedBnidEntry) {
      updatedBnidEntry.cpids.push({
        startTime: istDate.toISOString(),
        endTime: istDate.toISOString(),
        path: [CPID],
      });
      await updatedBeaconHistory.save();
    }

    delete timers[BNID];
  }, 1 * 60 * 1000);
};

const deleteBeacon = async (bnid) => {
  const { deletedCount } = await Beacon.deleteOne({
    bnid,
  });
  return deletedCount;
};

module.exports = {
  registerBeacon,
  // registerBeaconUser,
  assignBeaconUser,
  readAllBeacons,
  // readAllBeaconUsers,
  updateBeaconUserAck,
  // updateBeaconBatteryLowFlag,
  updateBeaconIsInDcsFlag,
  updateBeaconDCS,
  updateGWCPHealth,
  updateBeacon,
  deleteBeacon,
  readAllSosHistory,
  readSosHistoryOfDate,
};
