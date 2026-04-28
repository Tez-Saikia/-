import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdminJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.adminAccessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);

  if (!decoded?._id || decoded.role !== "admin") {
    throw new ApiError(403, "Access denied: Admins only!");
  }

  const admin = await Admin.findById(decoded._id).select(
    "-password -refreshToken",
  );

  if (!admin) {
    throw new ApiError(401, "Invalid Admin Access Token");
  }

  req.admin = admin;
  next();
});

// ✅ FLEXIBLE (USER + ADMIN)
export const verifyFlexibleJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.cookies?.adminAccessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decoded;

  // 🔥 Try admin first
  try {
    decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);

    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded._id).select(
        "-password -refreshToken",
      );
      if (!admin) throw new ApiError(401, "Admin not found");

      req.admin = admin;
      return next();
    }
  } catch (err) {}

  // 🔥 Try user
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = { _id: decoded._id };
    return next();
  } catch (err) {}

  throw new ApiError(401, "Invalid token");
});
