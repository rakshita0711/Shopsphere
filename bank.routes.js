import express from "express";
import Bank from "../models/Bank.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Bank.find({ active: true }));
});

router.post("/", async (req, res) => {
  res.json(await Bank.create(req.body));
});

router.put("/:id", async (req, res) => {
  res.json(await Bank.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", async (req, res) => {
  await Bank.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
