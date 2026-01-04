import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/auth.routes.js";

import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import bankRoutes from "./routes/bank.routes.js";
import bankAccountRoutes from "./routes/bankAccount.routes.js";
import bankTransactionRoutes from "./routes/bankTransaction.routes.js";
import cashRoutes from "./routes/cash.routes.js";
import cashTransactionRoutes from "./routes/cashTransaction.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import reportRoutes from "./routes/report.routes.js"; // ✅ FIXED
import ordersRoutes from "./routes/orders.routes.js";
import favouriteRoutes from "./routes/favourite.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));


// API ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.use("/api/banks", bankRoutes);
app.use("/api/bank-accounts", bankAccountRoutes);
app.use("/api/bank-transactions", bankTransactionRoutes);

app.use("/api/cash", cashRoutes);
app.use("/api/cash-transactions", cashTransactionRoutes);

app.use("/api/expenses", expenseRoutes);
app.use("/api/reports", reportRoutes); 

app.use("/api/orders", ordersRoutes);
app.use("/api/favourites", favouriteRoutes);



app.get("/", (req, res) => {
  res.send("🚀 ShopSphere Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
