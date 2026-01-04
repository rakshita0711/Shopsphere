import express from "express";
import {
  getBankTransactions,
  createBankTransaction,
  updateBankTransaction,
  deleteBankTransaction,
} from "../controllers/bank-transactions.controller.js";

const router = express.Router();

router.get("/", getBankTransactions);
router.post("/", createBankTransaction);
router.put("/:id", updateBankTransaction);   // ✅ REQUIRED
router.delete("/:id", deleteBankTransaction);

export default router;
