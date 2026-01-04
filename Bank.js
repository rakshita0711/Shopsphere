import mongoose from "mongoose";

const bankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Bank", bankSchema);
