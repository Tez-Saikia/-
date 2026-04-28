import mongoose from "mongoose";
import moment from "moment";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
    },
    senderModel: {
      type: String,
      enum: ["User", "Admin"],
      required: true,
    },
    media: [
      {
        url: String,
        publicId: String,
        type: {
          type: String,
          enum: ["image", "video", "file"],
        },
      },
    ],
    mediaPublicId: String,
    content: {
      type: String,
      required: function () {
        return !this.media || this.media.length === 0;
      },
    },
    clientId: {
      type: String,
      default: null,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        userModel: {
          type: String,
          enum: ["User", "Admin"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

messageSchema.virtual("formattedTime").get(function () {
  return moment(this.createdAt).format("DD MMM YYYY, h:mm A");
});

messageSchema.set("toJSON", { virtuals: true });
messageSchema.set("toObject", { virtuals: true });
messageSchema.plugin(aggregatePaginate);

export default mongoose.model("Message", messageSchema);
