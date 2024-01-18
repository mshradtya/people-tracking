const bcrypt = require("bcrypt");
const authService = require("../services/authService");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    const { accessToken, refreshToken, role, _id, username } =
      await authService.loginUser(email, password);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ _id, username, role, accessToken });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `${error.message}`,
    });
  }
};

const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;

    const { accessToken, role, _id, username, email } =
      await authService.refresh(refreshToken);

    res.json({ _id, username, role, email, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

const authUser = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "You must be authenticated to perform this operation.",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    const userDetail = await authService.authUser(token);

    if (!userDetail) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "user doesn't exist",
      });
    }
    res.body = userDetail;
    next();
  } catch (error) {
    if (error.name === "SyntaxError") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `Invalid token`,
      });
    }
    return res.status(403).json({
      status: 403,
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  loginUser,
  authUser,
  refresh,
  logout,
};
