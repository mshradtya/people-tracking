const ConnectPoint = require("../models/ConnectPoint");
const Beacon = require("../models/Beacon");

const registerConnectPoint = async (connectPointData) => {
  const connectPoint = new ConnectPoint(connectPointData);
  const newConnectPoint = await connectPoint.save();
  return newConnectPoint;
};

const readAllConnectPoints = async () => {
  const allConnectPoints = await ConnectPoint.find({});
  return allConnectPoints;
};

const updateConnectPointCoords = async (cpid, coords) => {
  const filter = { cpid };
  const update = { coords };
  const options = { new: true };

  const updatedConnectPoint = await ConnectPoint.findOneAndUpdate(
    filter,
    update,
    options
  );

  return updatedConnectPoint;
};

const updateConnectPointRoiCoords = async (cpid, roiCoords) => {
  const filter = { cpid };
  const update = { roiCoords };
  const options = { new: true };

  // Perform the update
  const updatedConnectPoint = await ConnectPoint.findOneAndUpdate(
    filter,
    update,
    options
  );

  return updatedConnectPoint;
};

const connectPointSosStatus = async () => {
  const connectPointsWithSos = await ConnectPoint.find({ sos: "H" }, "cpid");
  const cpidList = connectPointsWithSos.map(
    (connectPoint) => connectPoint.cpid
  );
  return cpidList;
};

// const deleteGateway = async (gwid) => {
//   const { deletedCount } = await Gateway.deleteOne({
//     gwid,
//   });
//   return deletedCount;
// };

module.exports = {
  registerConnectPoint,
  readAllConnectPoints,
  updateConnectPointCoords,
  updateConnectPointRoiCoords,
  connectPointSosStatus,
  //   deleteGateway,
};
