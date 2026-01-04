import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    // 1️⃣ CHECK & UPDATE PRODUCT STOCK
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json("Product not found");
      }

      if (product.quantity < item.qty) {
        return res
          .status(400)
          .json(`Insufficient stock for ${product.name}`);
      }

      // 🔥 DECREASE QUANTITY
      product.quantity -= item.qty;
      await product.save();
    }

    // 2️⃣ CREATE ORDER
    const order = await Order.create({
      ...req.body,
      status: "pending",
    });

    res.json({ orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= USER → GET OWN ORDERS ================= */
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("items.productId"); // 🔥 THIS IS KEY

    res.json(orders); // ❗ YOU MISSED THIS EARLIER
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= ADMIN → GET ORDERS (PAGINATED) ================= */
export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10; // ✅ 10 orders per page
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments();

    const orders = await Order.find()
      .populate("userId", "name email") // ✅ user details
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* ================= ADMIN → UPDATE STATUS ================= */


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
  req.params.id,
  { status },
  { new: true }
);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Reduce stock ONLY when approving
    if (status === "approved" && order.status !== "approved") {
      for (const item of order.items) {
        const product = await Product.findById(item.productId._id);

        if (!product) continue;

        if (product.quantity < item.qty) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}`,
          });
        }

        product.quantity -= item.qty;
        await product.save();
      }
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* ================= ADMIN → DELETE ORDER ================= */
export const deleteOrder = async (req, res) => {
  try { 
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};  


/* Cancel order */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json("Order not found");
    }

    // ❌ prevent cancel if already approved
    if (order.status === "approved") {
      return res.status(400).json("Approved order cannot be cancelled");
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

