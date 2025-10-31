// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // We'll define this model next

// ====== Create a new order ======
router.post("/", async (req, res) => {
  try {
    const { customerName, tableNumber, orderType, items, totalAmount, paymentMethod } = req.body;

    if (!customerName || !orderType || !items || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const newOrder = new Order({
      customerName,
      tableNumber: tableNumber || "",
      orderType,
      items,
      totalAmount,
      paymentMethod
    });

    await newOrder.save();
    res.json({ message: "Order saved successfully ✅", orderId: newOrder._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ====== Get all orders ======
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ====== Get order by ID ======
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/royalrestaurant", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// Routes
app.use("/api/order", orderRoutes); // all order-related routes

// Serve front-end
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "choice.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

