import express from "express";
import Cash from "../models/Cash.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const cash = await Cash.find();
  res.json(cash);
});

router.post("/", async (req, res) => {
  const cash = await Cash.create(req.body);
  res.status(201).json(cash);
});

router.put("/:id", async (req, res) => {
  const cash = await Cash.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cash);
});

router.delete("/:id", async (req, res) => {
  await Cash.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
