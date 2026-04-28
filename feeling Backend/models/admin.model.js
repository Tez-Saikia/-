import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: "admin" },
    process.env.ADMIN_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: "admin" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
