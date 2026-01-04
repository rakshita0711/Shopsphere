import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/* ===================== CREATE PRODUCT ===================== */
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product", error: err });
  }
});

/* ===================== GET ALL PRODUCTS ===================== */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name"); // 🔥 IMPORTANT
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
});

/* ===================== UPDATE PRODUCT ===================== */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err });
  }
});

/* ===================== DELETE PRODUCT ===================== */
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err });
  }
});

export default router;
