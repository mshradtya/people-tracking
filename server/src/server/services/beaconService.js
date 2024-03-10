const Beacon = require("../models/Beacon");

const registerBeacon = async (beaconData) => {
  const beacon = new Beacon(beaconData);
  const newBeacon = await beacon.save();
  return newBeacon;
};

const readAllBeacons = async () => {
  const allBeacons = await Beacon.find({}).populate("gateway", "gwid -_id");
  return allBeacons;
};

const updateBeacon = async (BNID, SOS, BATTERY) => {
  const updatedBeacon = await Beacon.findOneAndUpdate(
    { bnid: BNID },
    { sos: SOS, battery: BATTERY },
    { new: true, runValidators: true }
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
  readAllBeacons,
  updateBeacon,
  deleteGateway,
};
