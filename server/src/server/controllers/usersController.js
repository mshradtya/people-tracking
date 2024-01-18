const usersService = require("../services/usersService");
const { formattedDate } = require("../utils/helper");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  if (
    Object.keys(req.body).length !== 3 ||
    !(
      Object.keys(req.body).includes("username") &&
      Object.keys(req.body).includes("email") &&
      Object.keys(req.body).includes("password")
    )
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "username, email and password is required.",
    });
  }
  try {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: "User",
      dateRegistered: formattedDate(new Date()),
      devices: [],
    };
    const user = await usersService.registerUser(userData);
    return res.status(201).json({ status: 201, success: true, user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readAllUsers = async (req, res) => {
  if (res.body.role === "SuperAdmin") {
    const allUsers = await usersService.readAllUsers();
    if (allUsers.length === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: `There are no users.`,
      });
    }
    return res
      .status(200)
      .json({ status: 200, success: true, users: allUsers });
  } else {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }
};

const readUser = async (req, res) => {
  if (res.body.role === "SuperAdmin") {
    try {
      const userDetail = await usersService.readUser(req.params.id);
      if (userDetail === null) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: `User does not exist.`,
        });
      }
      return res
        .status(200)
        .json({ status: 200, success: true, user: userDetail });
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res
          .status(400)
          .json({ status: 400, success: false, message: `Invalid user ID.` });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `${error.message}`,
        });
      }
    }
  } else {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have SuperAdmin privilege to perform this operation.`,
    });
  }
};

const readUserDevices = async (req, res) => {
  if (res.body.role !== "User") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "Only users can view their devices",
    });
  }

  const userId = req.params.id;

  const devices = await usersService.readUserDevices(userId);

  return res.status(200).json({
    status: 200,
    success: true,
    devices: devices,
  });
};

const updateUsername = async (req, res) => {
  try {
    // user themselves can only update username
    if (req.params.id === res.body._id.toString()) {
      if (Object.keys(req.body).length !== 1) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `username is required.`,
        });
      }
      if (Object.keys(req.body).includes("username")) {
        const updatedUsername = await usersService.updateUsername(
          req.params.id,
          req.body.username
        );
        if (!updatedUsername) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `user does not exist`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `username updated`,
          user: updatedUsername,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `username is required.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You do not have sufficient privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `${error.message}`,
    });
  }
};

const updateEmail = async (req, res) => {
  try {
    // users themselves can only update their email
    if (req.params.id === res.body._id.toString()) {
      if (Object.keys(req.body).length !== 2) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `email and password is required to change the email.`,
        });
      }
      if (
        Object.keys(req.body).includes("email") &&
        Object.keys(req.body).includes("password")
      ) {
        if (!req.body.password) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `password cannot be blank.`,
          });
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          res.body.password
        );
        if (!passwordIsValid) {
          return res.status(401).json({
            status: 401,
            success: false,
            message: `password is not correct.`,
          });
        }
        const emailUpdate = await usersService.updateEmail(
          req.params.id,
          req.body.email
        );
        if (!emailUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `User does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `Your email has been updated.`,
          user: emailUpdate,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `provide a valid email and password to update email.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You do not have sufficient privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `${error.message}`,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    // only users themselves can update the password
    if (req.params.id === res.body._id.toString()) {
      if (Object.keys(req.body).length !== 3) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `oldPassword, newPassword, confirmNewPassword is required`,
        });
      }
      if (
        Object.keys(req.body).includes("oldPassword") &&
        Object.keys(req.body).includes("newPassword") &&
        Object.keys(req.body).includes("confirmNewPassword")
      ) {
        if (!req.body.oldPassword) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `oldPassword cannot be blank.`,
          });
        }
        if (!req.body.newPassword) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `newPassword cannot be blank.`,
          });
        }
        if (!req.body.confirmNewPassword) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `confirmNewPassword cannot be blank.`,
          });
        }
        if (req.body.newPassword.length > 256) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: "password cannot be more than 256 characters long.",
          });
        }

        if (req.body.newPassword.length < 8) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: "password cannot be less than 8 characters long.",
          });
        }
        if (req.body.newPassword !== req.body.confirmNewPassword) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: "newPassword and confirmNewPassword does not match.",
          });
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.oldPassword,
          res.body.password
        );
        if (!passwordIsValid) {
          return res.status(401).json({
            status: 401,
            success: false,
            message: `oldPassword is not correct.`,
          });
        }
        const passwordUpdated = await usersService.updatePassword(
          req.params.id,
          req.body.newPassword
        );
        if (!passwordUpdated) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `User does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `password updated.`,
          user: passwordUpdated,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `Please provide oldPassword, newPassword, and confirmNewPassword to update your password.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You do not have sufficient privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `${error.message}`,
    });
  }
};

const mongoose = require("mongoose");

const assignDevices = async (req, res) => {
  if (res.body.role !== "SuperAdmin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You must have SuperAdmin privilege to perform this operation",
    });
  }

  if (
    Object.keys(req.body).length !== 2 ||
    !Object.keys(req.body).includes("userId") ||
    !Object.keys(req.body).includes("deviceIds")
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "userId and deviceIds are required",
    });
  }

  const { userId, deviceIds } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid user id",
    });
  }

  try {
    const user = await usersService.assignDevices(userId, deviceIds);
    res.status(200).json({ status: 201, success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const deleteUsers = async (req, res) => {
  try {
    if (res.body.role === "SuperAdmin") {
      const deletedCount = await usersService.deleteUsers(req.params.id);
      if (deletedCount === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: `User does not exist.`,
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: `${deletedCount} users have been deleted.`,
      });
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You must be a SuperAdmin to perform this operation.`,
      });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `Invalid user ID`,
      });
    }
    return res.status(400).json({
      status: 400,
      success: false,
      message: `Something went wrong. ${error.message}`,
    });
  }
};

module.exports = {
  registerUser,
  readAllUsers,
  readUser,
  updateUsername,
  updateEmail,
  updatePassword,
  assignDevices,
  deleteUsers,
  readUserDevices,
};
