import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

categorySchema.plugin(aggregatePaginate);

categorySchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

const Category = mongoose.model("Category", categorySchema);

export default Category;