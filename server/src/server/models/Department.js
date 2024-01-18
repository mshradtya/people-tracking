// const mongoose = require("mongoose");

// const departmentSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     image: {
//       type: String,
//       required: true,
//     },
//     devices: [
//       {
//         device: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Device",
//         },
//         position: {
//           x: {
//             type: Number,
//             required: true,
//           },
//           y: {
//             type: Number,
//             required: true,
//           },
//         },
//       },
//     ],
//   },
//   { versionKey: false }
// );

// const Department = mongoose.model("Department", departmentSchema);

// module.exports = Department;

const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    dateRegistered: {
      type: Date,
      required: true,
      default: Date.now,
    },
    devices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
  },
  { versionKey: false }
);

departmentSchema.pre("save", async function (next) {
  const department = this;
  const departmentName = department.name.toUpperCase();
  department.name = departmentName;
  next();
});

departmentSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    if (error.keyPattern && error.keyPattern.name) {
      return next(
        new Error(`A department named '${doc.name}' already exists.`)
      );
    } else {
      return next(error);
    }
  }
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
