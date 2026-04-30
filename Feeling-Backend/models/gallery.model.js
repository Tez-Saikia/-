import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      required: true 
    },

    altText: {
      type: String,
      trim: true,
      required: true 
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
        required: true 
      },
    ],

    locationType: {
      type: String,
      required: true 
    },

    shootType: {
      type: String,
      required: true 
    },

    url: {
      type: String,
      required: true,
    },

    cloudinary_id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);


gallerySchema.plugin(aggregatePaginate);

const GalleryItem = mongoose.model("GalleryItem", gallerySchema);

export default GalleryItem;
