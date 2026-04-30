import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, (err, name) => {
      if (err) return cb(err);
      const fileName = name.toString("hex") + path.extname(file.originalname);
      cb(null, fileName);
    });
  },
});

const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");
  const isPdf = file.mimetype === "application/pdf";

  if (isImage || isVideo || isPdf) {
    cb(null, true);
  } else {
    cb(new Error("Only image, video, and PDF files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});
