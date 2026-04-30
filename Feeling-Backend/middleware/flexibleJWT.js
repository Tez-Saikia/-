import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

export const verifyFlexibleJWT = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.cookies?.adminAccessToken) {
      token = req.cookies.adminAccessToken;
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, no token provided",
      });
    }

let decoded;

try {
  decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);

  if (decoded.role !== "admin") {
    throw new Error("Not an admin token");
  }

} catch (adminError) {
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.role !== "user") {
      throw new Error("Not a user token");
    }

  } catch (userError) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

    if (!decoded?._id || !decoded?.role) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded._id).select(
        "-password -refreshToken",
      );

      if (!admin) {
        return res.status(401).json({ message: "Invalid admin token" });
      }

      req.admin = admin;
      req.user = null;
    } else if (decoded.role === "user") {
      const user = await User.findById(decoded._id).select(
        "-password -refreshToken",
      );

      if (!user) {
        return res.status(401).json({ message: "Invalid user token" });
      }

      req.user = user;
      req.admin = null;
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token error",
      error: err.message,
    });
  }
};
