const mongoose = require("mongoose");
const User = require("../models/User");
const departmentsService = require("../services/departmentsService");

const createDepartment = async (req, res) => {
  const name = req.body.name;

  if (res.body.role !== "SuperAdmin") {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorized",
    });
  }

  if (
    Object.keys(req.body).length !== 1 ||
    !Object.keys(req.body).includes("name")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "department name required",
    });
  }

  if (!name) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "department name cannot be empty",
    });
  }

  try {
    const department = await departmentsService.createDepartment(name);

    return res.status(200).json({
      status: 200,
      success: true,
      department,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `${err.message}`,
    });
  }
};

const readDepartments = async (req, res) => {
  if (res.body.role !== "SuperAdmin") {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const departments = await departmentsService.readDepartments();

    return res.status(200).json({
      status: 200,
      success: true,
      departments,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `${err.message}`,
    });
  }
};

const deleteDepartment = async (req, res) => {
  // Check user role
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }

  try {
    const id = req.params.id;
    const deletedCount = await departmentsService.deleteDepartment(id);
    if (deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `Department not found`,
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: `${deletedCount} department has been deleted`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

const assignDepartmentDevices = async (req, res) => {
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You must have SuperAdmin privilege to perform this operation",
    });
  }

  if (
    Object.keys(req.body).length !== 2 ||
    !Object.keys(req.body).includes("departmentId") ||
    !Object.keys(req.body).includes("deviceIds")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "departmentId and deviceIds are required",
    });
  }

  const { departmentId, deviceIds } = req.body;

  if (!mongoose.Types.ObjectId.isValid(departmentId)) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid department id",
    });
  }

  try {
    const department = await departmentsService.assignDepartmentDevices(
      departmentId,
      deviceIds
    );
    res.status(200).json({ status: 201, success: true, department });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

module.exports = {
  createDepartment,
  readDepartments,
  deleteDepartment,
  assignDepartmentDevices,
};

// const mongoose = require("mongoose");
// const User = require("../models/User");
// const departmentsService = require("../services/departmentsService");
// const multer = require("multer");
// const path = require("path");

// const createDepartment = async (request, response) => {
//   try {
//     // const { id, name } = request.query;
//     const id = request.params.id;
//     const name = request.body.name;

//     console.log(id, name);

//     if (!id || !name) {
//       return response.status(400).json({
//         status: 400,
//         success: false,
//         message: "User ID and department name are required",
//       });
//     }

//     // Check if the user has sufficient privileges
//     if (request.query.id === response.body._id.toString()) {
//       const user = await User.findById(id).populate("departments");
//       const departmentExists = user.departments.some(
//         (department) => department.name === name
//       );
//       if (departmentExists) {
//         throw new Error("Department name already exists for the user.");
//       }
//       handleFileUpload(request, response, id, name);
//     } else {
//       return response.status(403).json({
//         status: 403,
//         success: false,
//         message:
//           "You do not have sufficient privilege to perform this operation.",
//       });
//     }
//   } catch (error) {
//     return response.status(400).json({
//       status: 400,
//       success: false,
//       message: `${error.message}`,
//     });
//   }
// };

// const handleFileUpload = (request, response, id, name) => {
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, `src/server/uploads/users/departments`);
//     },
//     filename: function (req, file, cb) {
//       const formattedDate = new Date()
//         .toLocaleString("en-US", {
//           year: "numeric",
//           month: "2-digit",
//           day: "2-digit",
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//         })
//         .replace(/\//g, "-")
//         .replace(/,/, "-")
//         .replace(/\s+/g, "-")
//         .replace(/[ :]+/g, "-")
//         .replace(/--/, "-");

//       cb(
//         null,
//         name.toLowerCase() +
//           "-" +
//           formattedDate.toLowerCase() +
//           path.extname(file.originalname)
//       );
//     },
//   });

//   const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1000000 },
//     fileFilter: function (req, file, cb) {
//       if (
//         file.mimetype === "image/jpeg" ||
//         file.mimetype === "image/jpg" ||
//         file.mimetype === "image/png"
//       ) {
//         cb(null, true);
//       } else {
//         return response.status(400).json({
//           status: 400,
//           success: false,
//           message: "File must be a jpeg, jpg, or png file.",
//         });
//       }
//     },
//   });

//   upload.single("image")(request, response, function (error) {
//     if (error) {
//       if (error.message === "Unexpected field") {
//         return response.status(400).json({
//           status: 400,
//           success: false,
//           message: "department image is required.",
//         });
//       }
//       if (error.message === "File too large") {
//         return response.status(400).json({
//           status: 400,
//           success: false,
//           message: "File size cannot be more than 1MB.",
//         });
//       }
//       return response.status(400).json({
//         status: 400,
//         success: false,
//         message: `${error.message}`,
//       });
//     } else {
//       departmentsService
//         .createDepartment(id, name, request.file.path)
//         .then((resp) => {
//           return response.status(200).json({
//             status: 200,
//             success: true,
//             message: "Department created successfully.",
//             department: resp,
//           });
//         })
//         .catch((error) => {
//           return response.status(400).json({
//             status: 400,
//             success: false,
//             message: `${error.message}`,
//           });
//         });
//     }
//   });
// };

// const readDepartments = async (req, res) => {
//   const id = req.params.id;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: "Invalid user ID.",
//     });
//   }

//   if (req.params.id !== res.body._id.toString() || res.body.role !== "User") {
//     return res.status(403).json({
//       status: 403,
//       success: false,
//       message: `You do not have sufficient privilege to perform this operation.`,
//     });
//   }

//   try {
//     const departmentsList = await departmentsService.readDepartments(id);
//     return res.json({ departmentsList });
//   } catch (err) {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: `${err.message}`,
//     });
//   }
// };

// const addDevice = async (req, res) => {
//   if (
//     Object.keys(req.body).length !== 4 ||
//     !(
//       Object.keys(req.body).includes("departmentId") &&
//       Object.keys(req.body).includes("deviceId") &&
//       Object.keys(req.body).includes("x") &&
//       Object.keys(req.body).includes("y")
//     )
//   ) {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: "departmentId, deviceId, x and y required",
//     });
//   }

//   const { departmentId, deviceId, x, y } = req.body;

//   if (
//     !mongoose.Types.ObjectId.isValid(departmentId) ||
//     !mongoose.Types.ObjectId.isValid(deviceId)
//   ) {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: "invalid Id",
//     });
//   }

//   if (res.body.role !== "User") {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: "only Users can perform this operation",
//     });
//   }

//   try {
//     const department = await departmentsService.addDevice(
//       departmentId,
//       deviceId,
//       x,
//       y
//     );
//     return res.status(200).json({
//       status: 200,
//       success: true,
//       department,
//     });
//   } catch (err) {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: `${err.message}`,
//     });
//   }
// };

// const removeDevice = async (req, res) => {
//   if (
//     Object.keys(req.body).length !== 2 ||
//     !(
//       Object.keys(req.body).includes("departmentId") &&
//       Object.keys(req.body).includes("deviceId")
//     )
//   ) {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: "departmentId and deviceId required",
//     });
//   }

//   const { departmentId, deviceId } = req.body;

//   if (
//     !mongoose.Types.ObjectId.isValid(departmentId) ||
//     !mongoose.Types.ObjectId.isValid(deviceId)
//   ) {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: "invalid Id",
//     });
//   }

//   if (res.body.role !== "User") {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: "only Users can perform this operation",
//     });
//   }

//   try {
//     const department = await departmentsService.removeDevice(
//       departmentId,
//       deviceId
//     );
//     return res.status(200).json({
//       status: 200,
//       success: true,
//       department,
//     });
//   } catch (err) {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: `${err.message}`,
//     });
//   }
// };

// module.exports = {
//   createDepartment,
//   readDepartments,
//   addDevice,
//   removeDevice,
// };
