import mongoose from "mongoose";

const cashTransactionSchema = new mongoose.Schema({
  cashId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cash",
    required: true,
  },
  type: {
    type: String,
    enum: ["in", "out"],
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  remarks: String,
});

export default mongoose.model("CashTransaction", cashTransactionSchema);
