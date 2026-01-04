import mongoose from "mongoose";

const bankTransactionSchema = new mongoose.Schema({
  bankAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankAccount",
    required: true,
  },
  type: { type: String, enum: ["credit", "debit"] },
  amount: Number,
  date: String,
  remarks: String,
}, { timestamps: true });

export default mongoose.model("BankTransaction", bankTransactionSchema);
