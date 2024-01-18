const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      maxLength: 32,
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    refilledDate: {
      type: String,
    },
    expiryDate: {
      type: String,
    },
    empId: {
      type: String,
    },
    location: {
      type: String,
    },
    onDate: {
      type: String,
    },
    onTime: {
      type: String,
    },
    battery: {
      type: String,
    },
    networkStrength: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    // lastPacketDateTime: {
    //   type: String,
    // },
  },
  { versionKey: false }
);

deviceSchema.pre("save", async function (next) {
  const device = this;
  const deviceId = device.deviceId.toUpperCase();
  device.deviceId = deviceId;
  next();
});

deviceSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    // Handle duplicate deviceId error
    if (error.keyPattern && error.keyPattern.deviceId) {
      return next(
        new Error(
          `A device with the deviceId '${doc.deviceId}' already exists.`
        )
      );
    }
  }

  if (error.errors.deviceId) {
    if (error.errors.deviceId.kind === "required") {
      return next(new Error(`deviceId is required.`));
    }
    if (error.errors.deviceId.kind === "maxlength") {
      return next(new Error(`deviceId cannot be more than 32 characters.`));
    }
  }

  if (error.errors.status) {
    if (error.errors.status.kind === "enum") {
      return next(new Error(`valid status: 0, 1, and 2`));
    }
  }

  return next(error);
});

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
