import express from "express";
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
    deleteOrder,
  cancelOrder,
} from "../controllers/orders.controller.js";

const router = express.Router();

/* USER */
router.post("/", createOrder);
router.get("/user/:userId", getOrdersByUser);

/* ADMIN */
router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);
router.put("/:id/cancel", cancelOrder);


export default router;

