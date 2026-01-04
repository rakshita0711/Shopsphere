import express from "express";
import CashTransaction from "../models/CashTransaction.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tx = await CashTransaction.find().populate("cashId", "name");
  res.json(tx);
});

router.post("/", async (req, res) => {
  const tx = await CashTransaction.create(req.body);
  res.status(201).json(tx);
});

router.put("/:id", async (req, res) => {
  const tx = await CashTransaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(tx);
});

router.delete("/:id", async (req, res) => {
  await CashTransaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
