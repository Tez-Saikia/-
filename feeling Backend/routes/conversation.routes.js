import { Router } from "express";
import {
  createConversation,
  getUserConversations,
  getAdminConversations,
  sendMessage,
  getMessagesInConversation,
  deleteMessage,
  markMessagesAsRead,
  editMessage,
  getUnreadCount
} from "../controllers/conversation.controller.js"; 
import { verifyAdminJWT } from "../middleware/adminAuth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyFlexibleJWT } from "../middleware/flexibleJWT.js";
import { verifyUserJWT } from "../middleware/userAuth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = Router();

router.use(arcjetProtection);

router.post("/create", verifyFlexibleJWT, createConversation);
router.get("/my", verifyUserJWT, getUserConversations);
router.get("/admin", verifyAdminJWT, getAdminConversations);

router.get("/messages/unread-count", verifyFlexibleJWT, getUnreadCount);

router.post("/message", verifyFlexibleJWT, upload.array("files", 5), sendMessage);
router.get("/messages/:conversationId", verifyFlexibleJWT, getMessagesInConversation);
router.post(
  "/messages/:conversationId/read",
  verifyFlexibleJWT,
  markMessagesAsRead
);
router.delete("/message/:messageId/delete", verifyFlexibleJWT, deleteMessage);
router.patch("/message/:messageId/edit", verifyFlexibleJWT, editMessage);

export default router;