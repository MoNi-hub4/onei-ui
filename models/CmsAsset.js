import mongoose from "mongoose";

const CmsAssetSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    type: String,
    publicId: String,
  },
  { timestamps: true }
);

export default mongoose.models.CmsAsset ||
  mongoose.model("CmsAsset", CmsAssetSchema);