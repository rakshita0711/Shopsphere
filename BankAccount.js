import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema({
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
    required: true,
  },
  accountName: { type: String, required: true },
  accountNumber: String,
  openingBalance: Number,
  active: Boolean,
}, { timestamps: true });

export default mongoose.model("BankAccount", bankAccountSchema);
