import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import debug from "debug";
import dotenv from "dotenv";
import { ApiError } from "./apiErrors.js";

dotenv.config({ path: "./.env" });

const log = debug("upload:cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new ApiError(
        400,
        "No local file path provided for Cloudinary upload."
      );
    }

    if (!fs.existsSync(localFilePath)) {
      throw new ApiError(400, "File does not exist locally.");
    }

    const stats = fs.statSync(localFilePath);
    if (stats.size === 0) {
      fs.unlinkSync(localFilePath);
      throw new ApiError(400, "File is empty, cannot upload to Cloudinary.");
    }

    log("Uploading file: %s", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("Cloudinary upload response:", response);

    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    if (!response?.secure_url) {
      const errorMessage = response
        ? `Cloudinary response does not contain secure_url. Full response: ${JSON.stringify(
            response
          )}`
        : "Cloudinary did not return a valid response.";
      console.error(errorMessage);
      throw new ApiError(500, errorMessage);
    }

    return {
  secure_url: response.secure_url,
  public_id: response.public_id,
  resource_type: response.resource_type,
};
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, (err) => {
        if (err) console.error("Failed to delete local file:", err);
      });
    }
    console.error("Upload failed:", error);
    throw error;
  }
};

export { uploadOnCloudinary, cloudinary };
