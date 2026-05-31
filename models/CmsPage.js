import mongoose from "mongoose";

const CmsWidgetSchema = new mongoose.Schema(
  {
    id: Number,
    type: String,
    data: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const CmsPageSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      default: "home",
    },
    widgets: {
      type: [CmsWidgetSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

export default mongoose.models.CmsPage ||
  mongoose.model("CmsPage", CmsPageSchema);