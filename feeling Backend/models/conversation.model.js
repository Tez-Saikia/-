import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"; 

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

conversationSchema.plugin(aggregatePaginate); 

conversationSchema.index({ userId: 1, adminId: 1 }, { unique: true });

export default mongoose.model("Conversation", conversationSchema);
