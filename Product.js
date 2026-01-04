import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    quantity: Number,
    unit: String,
    price: Number,
    image: String,
    active: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
