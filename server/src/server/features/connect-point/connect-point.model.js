const mongoose = require("mongoose");

const connectPointSchema = new mongoose.Schema(
  {
    cpid: {
      type: Number,
      required: true,
      unique: true,
      min: 101,
      max: 200,
    },
    gwid: {
      type: Number,
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
    timestamp: {
      type: String,
    },
  },
  { versionKey: false }
);

connectPointSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    // Handle duplicate gwid error
    if (error.keyPattern && error.keyPattern.cpid) {
      return next(
        new Error(`A gateway with the id '${doc.cpid}' already exists.`)
      );
    }
  }

  if (error.errors.cpid) {
    if (error.errors.cpid.kind === "required") {
      return next(new Error(`Connect Point ID is required.`));
    }
    if (error.errors.cpid.kind === "Number") {
      return next(new Error(`Connect Point ID must be a valid number.`));
    }
    if (error.errors.cpid.kind === "min" || error.errors.cpid.kind === "max") {
      return next(
        new Error(
          `Gateway ID must be between ${connectPointSchema.obj.cpid.min} and ${connectPointSchema.obj.cpid.max}.`
        )
      );
    }
  }

  return next(error);
});

const ConnectPoint = mongoose.model("ConnectPoint", connectPointSchema);

module.exports = ConnectPoint;
