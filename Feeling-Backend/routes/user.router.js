import { Router } from "express";
import {
  changeUserPassword,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAccountDetails,
  updateUserAvatar,
  loginUser,
  googleLoginUser,
  deleteUserAccount
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyUserJWT } from "../middleware/userAuth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = Router();

router.use(arcjetProtection);

router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/refreshToken", refreshAccessToken);
router.post("/changePassword", verifyUserJWT, changeUserPassword);
router.get("/currentUser", verifyUserJWT, getCurrentUser);
router.patch("/updateUserAccount", verifyUserJWT, updateUserAccountDetails);
router.patch(
  "/updateUserAvatar",
  verifyUserJWT,
  upload.single("avatar"),
  updateUserAvatar
);
router.post("/google", googleLoginUser);

router.delete("/deleteAccount", verifyUserJWT, deleteUserAccount);

export default router;
