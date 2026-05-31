import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const SpecificationSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    value: { type: String, default: "" },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: String, required: true },
    image: { type: String, required: true },

    variants: { type: [VariantSchema], default: [] },

    category: { type: String, default: "" },
    productType: { type: String, default: "" },
    productSubType: { type: String, default: "" },
    brand: { type: String, default: "" },

    sku: { type: String, default: "" },
    stockStatus: {
      type: String,
      enum: ["in-stock", "out-of-stock", "pre-order", "coming-soon"],
      default: "in-stock",
    },

    description: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    specifications: { type: [SpecificationSchema], default: [] },

    warranty: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);