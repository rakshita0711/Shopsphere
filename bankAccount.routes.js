import express from "express";
import BankAccount from "../models/BankAccount.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await BankAccount.find().populate("bankId", "name");
  res.json(data);
});

router.post("/", async (req, res) => {
  res.json(await BankAccount.create(req.body));
});

router.put("/:id", async (req, res) => {
  res.json(await BankAccount.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", async (req, res) => {
  await BankAccount.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
