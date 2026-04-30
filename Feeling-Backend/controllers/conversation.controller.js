import { asyncHandler } from "../utils/asyncHandler.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Admin from "../models/admin.model.js";
import { uploadOnCloudinary, cloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiErrors.js";

/* Verify Conv Ownership */
const findAuthorizedConversation = async (
  conversationId,
  currentUserId,
  isAdmin,
) => {
  if (!currentUserId) return null;

  if (isAdmin) {
    return await Conversation.findOne({
      _id: conversationId,
      adminId: currentUserId,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(conversationId)) return null;

  return await Conversation.findOne({
    _id: conversationId,
    userId: currentUserId,
  });
};

/* Create Conv */
export const createConversation = asyncHandler(async (req, res) => {
  const currentUser = req.user || req.admin;

  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }

  let userId;

  if (req.user) {
    userId = req.user._id;
  } else {
    userId = req.body.userId;
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "UserId required",
    });
  }

  const admin = await Admin.findOne();
  if (!admin) {
    return res.status(500).json({
      success: false,
      message: "Admin not found",
    });
  }

  const existing = await Conversation.findOne({
    userId,
    adminId: admin._id,
  });

  if (existing) {
    return res.status(200).json({
      success: true,
      conversation: existing,
    });
  }

  const conversation = await Conversation.create({
    userId,
    adminId: admin._id,
  });

  res.status(201).json({
    success: true,
    conversation,
  });
});

/* Get User Conversations */
export const getUserConversations = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }

  const conversations = await Conversation.find({
    userId: req.user._id,
  })
    .populate("userId", "username email avatar")
    .populate("adminId", "username email avatar");

  res.status(200).json({
    success: true,
    conversations,
  });
});

/* Get Admin Conversations */
export const getAdminConversations = asyncHandler(async (req, res) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }

  const adminId = req.admin._id;

  const conversations = await Conversation.find({
    adminId: req.admin._id,
    userId: { $ne: null },
  })
    .populate("userId", "username email avatar")
    .sort({ updatedAt: -1 });

  const uniqueMap = new Map();

  conversations.forEach((conv) => {
    if (conv.userId?._id) {
      uniqueMap.set(conv.userId._id.toString(), conv);
    }
  });

  const uniqueConversations = Array.from(uniqueMap.values());

  const conversationsWithUnread = await Promise.all(
    uniqueConversations.map(async (conv) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        senderId: { $ne: adminId },
        deleted: false,
        readBy: {
          $not: {
            $elemMatch: { userId: adminId },
          },
        },
      });

      const lastMessage = await Message.findOne({
        conversationId: conv._id,
        deleted: false,
      })
        .populate("senderId", "username avatar")
        .sort({ createdAt: -1 });

      const formattedLastMessage = lastMessage
        ? {
            ...lastMessage.toObject(),
            sender: lastMessage.senderId,
          }
        : null;
      return {
        ...conv.toObject(),
        unreadCount,
        lastMessage: formattedLastMessage,
      };
    }),
  );

  res.status(200).json({
    success: true,
    conversations: conversationsWithUnread,
  });
});

/* Send Message */
export const sendMessage = asyncHandler(async (req, res) => {
  console.log("📩 SEND MESSAGE HIT");
  console.log("REQ HEADERS:", req.headers.authorization);
  console.log("IS ADMIN:", !!req.admin);
  console.log("IS USER:", !!req.user);

  console.log("COOKIES:", req.cookies);
  console.log("REQ.USER:", req.user);
  console.log("REQ.ADMIN:", req.admin);
  const { conversationId, content, clientId } = req.body;

  if (!conversationId) {
    return res.status(400).json({
      success: false,
      message: "conversationId is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid conversationId",
    });
  }

  const isAdmin = !!req.admin;

  const currentUserId = isAdmin ? req.admin._id : req.user?._id;

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }
  console.log("AUTH DEBUG:", {
    user: req.user,
    admin: req.admin,
  });

  if (!conversationId || (!content && (!req.files || req.files.length === 0))) {
    return res.status(400).json({
      success: false,
      message: "Message content or at least one file is required",
    });
  }

  const senderModel = isAdmin ? "Admin" : "User";
  console.log("SENDER MODEL:", senderModel);

  const conversation = await findAuthorizedConversation(
    conversationId,
    currentUserId,
    !!req.admin,
  );
  console.log("FOUND CONVERSATION:", conversation);

  if (!conversation) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this conversation",
    });
  }

  let media = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);

      const mediaType = file.mimetype.startsWith("image/")
        ? "image"
        : file.mimetype.startsWith("video/")
          ? "video"
          : "file";

      media.push({
        url: result.secure_url,
        publicId: result.public_id,
        type: mediaType,
      });
    }
  }

  const message = await Message.create({
    senderId: currentUserId,
    senderModel,
    content: content || null,
    conversationId,
    media,
    clientId: clientId || null,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    $push: { messages: message._id },
    $set: { updatedAt: new Date() },
  });

  const populatedMessage = await Message.findById(message._id)
    .populate("senderId", "username avatar")
    .lean();

  const formattedMessage = {
    _id: message._id.toString(),
    content: message.content,
    conversationId: message.conversationId.toString(),

    sender: populatedMessage.senderId
      ? {
          _id: populatedMessage.senderId._id,
          username: populatedMessage.senderId.username,
          avatar: populatedMessage.senderId.avatar,
        }
      : null,

    senderId: message.senderId.toString(),

    senderModel: message.senderModel,

    media: message.media,
    createdAt: message.createdAt,
    clientId: message.clientId,
  };

  global.io
    ?.to(conversationId.toString())
    .emit("receive-message", formattedMessage);

  res.status(201).json({
    success: true,
    message: formattedMessage,
  });

  global.io?.emit("dashboard:newMessage");
});

/* Get Messages */
export const getMessagesInConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const currentUserId = req.admin?._id || req.user?._id;

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }

  const conversation = await findAuthorizedConversation(
    conversationId,
    currentUserId,
    !!req.admin,
  );

  if (!conversation) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this conversation",
    });
  }

  const messages = await Message.find({
    conversationId,
    deleted: false,
  })
    .populate("senderId", "username avatar")
    .sort({ createdAt: 1 });

  const formattedMessages = messages.map((msg) => {
    const senderObj = msg.senderId;

    return {
      _id: msg._id.toString(),
      content: msg.content,
      conversationId: msg.conversationId.toString(),

      sender: senderObj
        ? {
            _id: senderObj._id.toString(),
            username: senderObj.username,
            avatar: senderObj.avatar,
          }
        : null,

      senderId: senderObj?._id?.toString(),
      senderModel: msg.senderModel,

      media: msg.media,
      createdAt: msg.createdAt,
      readBy: msg.readBy,
      clientId: msg.clientId,
    };
  });

  res.status(200).json({
    success: true,
    messages: formattedMessages,
  });
});

/* Delete Message */
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // 🔥 Delete media from Cloudinary if exists
  if (message.media && message.media.length > 0) {
    for (const file of message.media) {
      if (file.publicId) {
        try {
          await cloudinary.uploader.destroy(file.publicId);
        } catch (error) {
          console.error("Cloudinary delete error:", error.message);
        }
      }
    }
  }

  // Delete message from DB
  await message.deleteOne();

  res.status(200).json({
    success: true,
    message: "Message and media deleted successfully",
  });
});

/* Edit Message */
export const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({
      success: false,
      message: "Content is required",
    });
  }

  const message = await Message.findById(messageId);

  if (!message || message.deleted) {
    return res.status(404).json({
      success: false,
      message: "Message not found",
    });
  }

  const isAdmin = !!req.admin;

  const currentUserId = isAdmin ? req.admin._id : req.user?._id;

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }

  if (message.senderId.toString() !== currentUserId.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized",
    });
  }

  message.content = content;
  message.edited = true;

  await message.save();

  res.status(200).json({
    success: true,
    message,
  });
});

/* Mark As Read */
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const isAdmin = !!req.admin;

  const currentUserId = isAdmin ? req.admin._id : req.user?._id;

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }

  const readerModel = req.user ? "User" : "Admin";

  const conversation = await findAuthorizedConversation(
    conversationId,
    currentUserId,
    !!req.admin,
  );

  if (!conversation) {
    return res.status(403).json({
      success: false,
      message: "Not authorized",
    });
  }

  const result = await Message.updateMany(
    {
      conversationId,
      senderId: { $ne: currentUserId },
      deleted: false,
      readBy: {
        $not: {
          $elemMatch: { userId: currentUserId },
        },
      },
    },
    {
      $push: {
        readBy: {
          userId: currentUserId,
          userModel: readerModel,
        },
      },
    },
  );

  res.status(200).json({
    success: true,
    updatedCount: result.modifiedCount,
  });
  global.io?.to(conversationId.toString()).emit("messages-read", {
    conversationId,
    userId: currentUserId,
    userModel: readerModel,
  });
});

/* Get Unread Count */
export const getUnreadCount = asyncHandler(async (req, res) => {
  const isAdmin = !!req.admin;

  const currentUserId = isAdmin ? req.admin._id : req.user?._id;

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }

  const conversations = await Conversation.find({
    $or: [{ userId: currentUserId }, { adminId: currentUserId }],
  }).select("_id");

  const conversationIds = conversations.map((c) => c._id);

  const unreadCount = await Message.countDocuments({
    conversationId: { $in: conversationIds },
    senderId: { $ne: currentUserId },
    deleted: false,
    readBy: {
      $not: {
        $elemMatch: { userId: currentUserId },
      },
    },
  });

  res.status(200).json({
    success: true,
    unreadCount,
  });
});
