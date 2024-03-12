const mongoose = require("mongoose");

const gatewaySchema = new mongoose.Schema(
  {
    gwid: {
      type: Number,
      required: true,
      unique: true,
      min: 201,
      max: 250,
    },
    coords: {
      x: {
        type: Number,
      },
      y: {
        type: Number,
      },
    },
    roiCoords: [{ type: Number }],
    sos: {
      type: String,
      enum: ["H", "L"],
      required: true,
    },
    beacons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beacon",
      },
    ],
  },
  { versionKey: false }
);

gatewaySchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    // Handle duplicate gwid error
    if (error.keyPattern && error.keyPattern.gwid) {
      return next(
        new Error(`A gateway with the id '${doc.gwid}' already exists.`)
      );
    }
  }

  if (error.errors.gwid) {
    if (error.errors.gwid.kind === "required") {
      return next(new Error(`gateway id is required.`));
    }
    if (error.errors.gwid.kind === "Number") {
      return next(new Error(`Gateway ID must be a valid number.`));
    }
    if (error.errors.gwid.kind === "min" || error.errors.gwid.kind === "max") {
      return next(
        new Error(
          `Gateway ID must be between ${gatewaySchema.obj.gwid.min} and ${gatewaySchema.obj.gwid.max}.`
        )
      );
    }
  }

  return next(error);
});

const Gateway = mongoose.model("Gateway", gatewaySchema);

module.exports = Gateway;
