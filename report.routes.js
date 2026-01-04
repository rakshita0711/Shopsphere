import express from "express";
import Expense from "../models/Expense.js";
import CashTransaction from "../models/CashTransaction.js";
import BankTransaction from "../models/BankTransaction.js";

const router = express.Router();

/* ===================== REPORT SUMMARY ===================== */
router.get("/", async (req, res) => {
  try {
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalCashIn = await CashTransaction.aggregate([
      { $match: { type: "in" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalCashOut = await CashTransaction.aggregate([
      { $match: { type: "out" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalBankCredit = await BankTransaction.aggregate([
      { $match: { type: "credit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalBankDebit = await BankTransaction.aggregate([
      { $match: { type: "debit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      cashIn: totalCashIn[0]?.total || 0,
      cashOut: totalCashOut[0]?.total || 0,
      bankCredit: totalBankCredit[0]?.total || 0,
      bankDebit: totalBankDebit[0]?.total || 0,
      expenses: totalExpenses[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Report generation failed", error });
  }
});

export default router;
