import jwt from "jsonwebtoken";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import Admin from "../models/admin.model.js";
import { APiResponse } from "../utils/apiResponse.js";
import Category from "../models/category.model.js";
import GalleryItem from "../models/gallery.model.js";
import { uploadOnCloudinary, cloudinary } from "../utils/cloudinary.js";
import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/",
     maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

const generateAccessAndRefreshTokens = async (adminId) => {
  const admin = await Admin.findById(adminId).select("+refreshToken");
  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  admin.refreshToken = hashToken(refreshToken);
  await admin.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new ApiError(400, "All fields are required");
  if (!email.trim().endsWith("@gmail.com"))
    throw new ApiError(400, "Email must be a Gmail address");
  if (password.length < 6)
    throw new ApiError(400, "Password must be at least 6 characters");

  const adminExists = await Admin.findOne();
  if (adminExists) throw new ApiError(403, "Admin is already registered");

  const admin = await Admin.create({ name, email, password });

  const createdAdmin = await Admin.findById(admin._id).select("name email");

  res
    .status(201)
    .json(new APiResponse(201, createdAdmin, "Admin created successfully!"));
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, "Email and password are required");

  const admin = await Admin.findOne({ email }).select(
    "+password +refreshToken",
  );
  if (!admin) throw new ApiError(404, "Admin not found");

  const onlyAdmin = await Admin.findOne();
  if (admin._id.toString() !== onlyAdmin._id.toString()) {
    throw new ApiError(
      403,
      "Access restricted: Only the registered admin can log in",
    );
  }

  const isPasswordCorrect = await admin.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Password is incorrect");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    admin._id,
  );
  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken",
  );

  res
    .status(200)
    .cookie("adminAccessToken", accessToken, getCookieOptions())
    .cookie("adminRefreshToken", refreshToken, getCookieOptions())
    .json(
      new APiResponse(
        200,
        { admin: loggedInAdmin },
        "Admin logged in successfully!",
      ),
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken =
    req.cookies?.adminRefreshToken || req.body?.refreshToken;

  if (!incomingToken) throw new ApiError(401, "Unauthorized request");

  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const admin = await Admin.findById(decoded._id).select("+refreshToken");
  if (!admin) throw new ApiError(401, "Admin not found");

  if (hashToken(incomingToken) !== admin.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    admin._id,
  );

  res
    .status(200)
    .cookie("adminAccessToken", accessToken, getCookieOptions())
    .cookie("adminRefreshToken", refreshToken, getCookieOptions())
    .json(
      new APiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed",
      ),
    );
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  const adminId = req.admin?._id;
  if (adminId)
    await Admin.findByIdAndUpdate(adminId, { $unset: { refreshToken: 1 } });

  res
    .clearCookie("adminAccessToken", getCookieOptions())
    .clearCookie("adminRefreshToken", getCookieOptions())
    .status(200)
    .json(new APiResponse(200, {}, "Admin logged out successfully"));
});

export const createCategory = asyncHandler(async (req, res) => {
  let { name } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  name = name.trim();

  const exists = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (exists) {
    throw new ApiError(400, "Category already exists");
  }

  const category = await Category.create({ name });

  res
    .status(201)
    .json(new APiResponse(201, category, "Category created successfully"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(404, "Category not found");

  const galleryItems = await GalleryItem.find({ category: categoryId });
  const notDeleted = [];

  await Promise.all(
    galleryItems.map(async (item) => {
      if (item.cloudinary_id) {
        try {
          await cloudinary.uploader.destroy(item.cloudinary_id);
        } catch (err) {
          notDeleted.push(item._id);
        }
      }
    }),
  );

  await GalleryItem.deleteMany({ category: categoryId });
  await Category.findByIdAndDelete(categoryId);

  res
    .status(200)
    .json(
      new APiResponse(
        200,
        { notDeleted },
        "Category and associated media deleted",
      ),
    );
});

export const uploadController = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0)
    throw new ApiError(400, "Files are required");

  const { categoryId, tags, locationType, shootType, description, altText } =
    req.body;

  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(400, "Invalid category");

  const uploadedItems = [];

  for (const file of req.files) {
    const result = await uploadOnCloudinary(file.path);
    const type = result.resource_type === "video" ? "video" : "image";

    const galleryItem = await GalleryItem.create({
      title: file.originalname,
      url: result.secure_url,
      cloudinary_id: result.public_id,
      type,
      category: category._id,
      uploadedBy: req.admin._id,

      tags: tags ? tags.split(",").map((tag) => tag.trim().toLowerCase()) : [],
      locationType,
      shootType,
      description,
      altText,
    });

    uploadedItems.push(galleryItem);
  }

  res
    .status(201)
    .json(new APiResponse(201, uploadedItems, "Files uploaded successfully"));
});

export const getAllGalleryItems = asyncHandler(async (req, res) => {
  const { category, locationType, shootType, search } = req.query;

  let filter = {};

  if (category) filter.category = category;
  if (locationType) filter.locationType = locationType;
  if (shootType) filter.shootType = shootType;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const items = await GalleryItem.find(filter)
    .sort({ createdAt: -1 })
    .populate("category", "name");

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

export const getGalleryByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const items = await GalleryItem.find({ category: categoryId }).populate(
    "category",
    "name",
  );
  res.status(200).json({ success: true, count: items.length, data: items });
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const item = await GalleryItem.findById(itemId);
  if (!item) throw new ApiError(404, "Media not found");

  if (item.cloudinary_id) {
    await cloudinary.uploader.destroy(item.cloudinary_id, {
      resource_type: item.type === "video" ? "video" : "image",
    });
  }

  await GalleryItem.findByIdAndDelete(itemId);

  res.status(200).json(new APiResponse(200, {}, "Media deleted successfully"));
});

export const currentAdmin = asyncHandler(async (req, res) => {
  if (!req.admin?._id) {
    throw new ApiError(401, "Admin not authenticated");
  }

  const admin = await Admin.findById(req.admin._id).select(
    "-password -refreshToken",
  );

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return res
    .status(200)
    .json(
      new APiResponse(200, { admin }, "Current admin fetched successfully"),
    );
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalImages = await GalleryItem.countDocuments({ type: "image" });
  const totalVideos = await GalleryItem.countDocuments({ type: "video" });
  const totalCategories = await Category.countDocuments();

  const unreadChats = await messageModel.countDocuments({
    senderId: { $ne: req.admin._id },
    readBy: {
      $not: {
        $elemMatch: { userId: req.admin._id },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: {
      totalImages,
      totalVideos,
      totalCategories,
      unreadChats,
    },
  });
});

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginAdmin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential missing");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, sub, picture } = ticket.getPayload();

  const admin = await Admin.findOne().select("+refreshToken");

  if (!admin) {
    throw new ApiError(403, "Admin not registered");
  }

  // 1️⃣ Strict email match
  if (email !== admin.email) {
    throw new ApiError(403, "Unauthorized Google admin account");
  }

  // 2️⃣ If already linked, enforce same Google ID
  if (admin.googleId && admin.googleId !== sub) {
    throw new ApiError(403, "Google account mismatch");
  }

  // 3️⃣ First-time linking
  if (!admin.googleId) {
    admin.googleId = sub;
  }

  // 4️⃣ Optional: update avatar
  if (picture) {
    admin.avatar = picture;
  }

  await admin.save({ validateBeforeSave: false });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    admin._id,
  );

  const safeAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("adminAccessToken", accessToken, getCookieOptions())
    .cookie("adminRefreshToken", refreshToken, getCookieOptions())
    .json(
      new APiResponse(
        200,
        { admin: safeAdmin },
        "Admin logged in with Google successfully!",
      ),
    );
});
