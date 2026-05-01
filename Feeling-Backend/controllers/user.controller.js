import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { cloudinary } from "../utils/cloudinary.js";
import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { welcomeEmailTemplate } from "../src/emails/welcomeEmailTemplate.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId).select("+refreshToken");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch {
    throw new ApiError(500, "Error while generating tokens!");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ([username, email, password].some((item) => item?.trim() === "")) {
    throw new ApiError(400, "All fields are required!");
  }
  if (!email.trim().endsWith("@gmail.com")) {
    throw new ApiError(400, "Email is not valid!");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters!");
  }
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    if (existedUser.isGoogleUser) {
      throw new ApiError(
        400,
        "This email is registered with Google. Please login using Google.",
      );
    }

    throw new ApiError(409, "User already exists!");
  }
  const avatarFile = req.files?.avatar?.[0];
  if (!avatarFile) throw new ApiError(400, "Avatar is required!");
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];
  if (!validImageTypes.includes(avatarFile.mimetype)) {
    fs.unlinkSync(avatarFile.path);
    throw new ApiError(400, "Only image files are allowed for avatar!");
  }
  const avatar = await uploadOnCloudinary(avatarFile.path);
  if (!avatar) throw new ApiError(400, "Avatar upload failed!");
  const user = await User.create({
    username: username.toLowerCase(),
    avatar: avatar.secure_url,
    email: email.toLowerCase(),
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!createdUser) throw new ApiError(500, "Error while creating user!");

  const html = welcomeEmailTemplate({
    username: createdUser.username,
    company: process.env.EMAIL_FROM_NAME,
  });

  sendEmail({
    to: createdUser.email,
    subject: "Welcome 🎉",
    html,
  }).catch((err) => {
    console.error("Email failed:", err.message);
  });
  return res
    .status(201)
    .json(new APiResponse(200, createdUser, "User created successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, "Email and password are required!");

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) throw new ApiError(404, "User not found!");

  if (user.isGoogleUser) {
    throw new ApiError(
      400,
      "This account was created with Google. Please login using Google.",
    );
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) throw new ApiError(401, "Password is incorrect!");

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, getCookieOptions())
    .cookie("refreshToken", refreshToken, getCookieOptions())
    .json(
      new APiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully!",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      await User.findByIdAndUpdate(decoded?._id, {
        $unset: { refreshToken: 1 },
      });
    }
  } catch (err) {
    console.warn("JWT decode failed during logout:", err.message);
  }

  res
    .clearCookie("accessToken", getCookieOptions())
    .clearCookie("refreshToken", getCookieOptions())
    .status(200)
    .json(new APiResponse(200, null, "User logged out successfully!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request!");
  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decoded?._id).select("+refreshToken");
    if (!user) throw new ApiError(401, "User not found!");
    if (incomingRefreshToken !== user.refreshToken)
      throw new ApiError(401, "Refresh token is expired or invalid!");
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, getCookieOptions())
      .cookie("refreshToken", newRefreshToken, getCookieOptions())
      .json(
        new APiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid refresh token!");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new APiResponse(200, req.user, "Current user fetched successfully!"));
});

const updateUserAccountDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "At least username or email is required!");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isGoogleUser && email && email !== user.email) {
    throw new ApiError(
      400,
      "Email cannot be changed for accounts created with Google.",
    );
  }

  if (username && username !== user.username) {
    const existingUsername = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUsername) {
      throw new ApiError(400, "Username already taken");
    }
    user.username = username.toLowerCase();
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new ApiError(400, "Email already in use");
    }
    user.email = email.toLowerCase();
  }

  await user.save();

  const updatedUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .json(
      new APiResponse(
        200,
        updatedUser,
        "User account details updated successfully!",
      ),
    );
});

const updateUserAvatar = async (req, res) => {
  try {
    console.log("req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 Delete old image safely
    if (user.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(user.cloudinaryPublicId);
      } catch (err) {
        console.log("Old image delete failed:", err.message);
      }
    }

    // 🔥 Upload new image
    const uploadedAvatar = await uploadOnCloudinary(req.file.path);

    user.avatar = uploadedAvatar.secure_url;
    user.cloudinaryPublicId = uploadedAvatar.public_id;

    await user.save();

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Avatar update crash:", error);
    return res.status(500).json({
      success: false,
      message: "Avatar update failed",
    });
  }
};

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user) throw new ApiError(404, "User not found");

  if (user.isGoogleUser) {
    throw new ApiError(
      400,
      "This account was created using Google. Password cannot be changed.",
    );
  }

  if (!oldPassword || !newPassword)
    throw new ApiError(400, "Old and new passwords are required");

  const isMatch = await user.isPasswordCorrect(oldPassword);

  if (!isMatch) throw new ApiError(401, "Old password is incorrect");

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new APiResponse(200, null, "Password updated successfully"));
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (user.cloudinaryPublicId) {
    await cloudinary.uploader.destroy(user.cloudinaryPublicId);
  }

  const conversations = await conversationModel.find({ userId });
  const conversationIds = conversations.map((c) => c._id);

  const messages = await messageModel.find({
    conversationId: { $in: conversationIds },
  });

  for (const message of messages) {
    if (message.media?.length) {
      for (const file of message.media) {
        if (file.publicId) {
          await cloudinary.uploader.destroy(file.publicId);
        }
      }
    }
  }

  await messageModel.deleteMany({
    conversationId: { $in: conversationIds },
  });

  await conversationModel.deleteMany({ userId });

  await user.deleteOne();

  res
    .clearCookie("accessToken", getCookieOptions())
    .clearCookie("refreshToken", getCookieOptions())
    .status(200)
    .json(new APiResponse(200, null, "User account deleted successfully"));
});

const googleLoginUser = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is missing");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { sub, email, name, picture, email_verified } = ticket.getPayload();

  if (!email_verified) {
    throw new ApiError(400, "Google email is not verified");
  }

  let user = await User.findOne({ googleId: sub }).select("+refreshToken");

  if (!user) {
    user = await User.findOne({ email });

    if (user) {
      if (user.googleId && user.googleId !== sub) {
        throw new ApiError(
          400,
          "This email is already linked to another Google account.",
        );
      }

      if (!user.googleId) {
        user.googleId = sub;
        user.isGoogleUser = true;

        await user.save();
      }
    } else {
      let baseUsername =
        name?.toLowerCase().replace(/\s+/g, "") || email.split("@")[0];

      let username = baseUsername;
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      const uploadedAvatar = await cloudinary.uploader.upload(picture, {
        folder: "users",
      });

      user = await User.create({
        username,
        email,
        avatar: uploadedAvatar.secure_url,
        cloudinaryPublicId: uploadedAvatar.public_id,
        googleId: sub,
        isGoogleUser: true,
      });
    }
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, getCookieOptions())
    .cookie("refreshToken", refreshToken, getCookieOptions())
    .json(
      new APiResponse(200, { user: loggedInUser }, "Google login successful"),
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUserAccountDetails,
  updateUserAvatar,
  changeUserPassword,
  deleteUserAccount,
  googleLoginUser,
};
