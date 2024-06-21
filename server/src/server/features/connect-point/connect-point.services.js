const ConnectPoint = require("./connect-point.model");
const Gateway = require("../gateway/gateway.model");
const { getMinutesDifference } = require("../../utils/helper");
const { formattedDate } = require("../../utils/helper");

const registerConnectPoint = async (connectPointData) => {
  const connectPoint = new ConnectPoint(connectPointData);
  const newConnectPoint = await connectPoint.save();
  return newConnectPoint;
};

const readAllConnectPoints = async () => {
  const allConnectPoints = await ConnectPoint.find({});
  return allConnectPoints;
};

const connectPointsNotWorking = async () => {
  const allConnectPoints = await ConnectPoint.find({});
  let notWorkingConnectPoints = [];

  for (const connectPoint of allConnectPoints) {
    const timeDifference = getMinutesDifference(connectPoint.timestamp);
    if (timeDifference > 30) {
      notWorkingConnectPoints.push(connectPoint.cpid);
    }
  }

  return notWorkingConnectPoints;
};

const updateConnectPointCoords = async (cpid, coords, roiCoords) => {
  const filter = { cpid };
  const update = { coords, roiCoords };
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

const deleteConnectPoint = async (cpid) => {
  const { deletedCount } = await ConnectPoint.deleteOne({
    cpid,
  });
  return deletedCount;
};

const refreshConnectPoints = async () => {
  const currentTime = formattedDate();
  const update = { timestamp: currentTime };
  await ConnectPoint.updateMany({}, update);
  await Gateway.updateMany({}, update);
};

module.exports = {
  registerConnectPoint,
  readAllConnectPoints,
  connectPointsNotWorking,
  updateConnectPointCoords,
  updateConnectPointRoiCoords,
  connectPointSosStatus,
  deleteConnectPoint,
  refreshConnectPoints,
};
