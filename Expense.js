import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentType: {
    type: String,
    enum: ["cash", "bank"],
    required: true,
  },
  cashId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cash",
  },
  bankAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankAccount",
  },
  date: { type: String, required: true },
  remarks: String,
});

export default mongoose.model("Expense", expenseSchema);
