import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getGalleryByCategory,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  uploadController,
  currentAdmin,
  deleteGalleryItem,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { verifyAdminJWT } from "../middleware/adminAuth.middleware.js";
import { refreshAccessToken } from "../controllers/admin.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { getAllGalleryItems } from "../controllers/admin.controller.js";
import Category from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { googleLoginAdmin } from "../controllers/admin.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = Router();

router.route("/register").post(arcjetProtection,registerAdmin);

router.route("/login").post(arcjetProtection,loginAdmin);

router.route("/logout").post(verifyAdminJWT, logoutAdmin);

router.route("/refreshToken").post(arcjetProtection,refreshAccessToken);

router.route("/category").post(verifyAdminJWT, createCategory);

router.route("/categories").get(
  asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  }),
);

router.route("/category/:categoryId").delete(verifyAdminJWT, deleteCategory);

router
  .route("/upload")
  .post(verifyAdminJWT, upload.array("files", 5), uploadController);

router.route("/gallery/all").get(getAllGalleryItems);

router.route("/gallery/category/:categoryId").get(getGalleryByCategory);

router.route("/gallery/item/:itemId").delete(verifyAdminJWT, deleteGalleryItem);

router.get("/currentAdmin", verifyAdminJWT, currentAdmin);

router.post("/google",arcjetProtection, googleLoginAdmin);

router.get("/dashboard/stats", verifyAdminJWT, getDashboardStats);

export default router;
