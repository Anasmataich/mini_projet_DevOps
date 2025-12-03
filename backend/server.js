import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Validation Schemas
const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
  images: Joi.array().items(Joi.string().uri()).default([])
});

const orderSchema = Joi.object({
  user_id: Joi.string().required(),
  items: Joi.array().items(Joi.object({
    product_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0).required()
  })).min(1).required()
});

// ---------------------------
// PRODUCTS API
// ---------------------------

// GET /products - List all products with search & filter
app.get("/products", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (search) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (minPrice) {
      query += " AND price >= ?";
      params.push(minPrice);
    }
    if (maxPrice) {
      query += " AND price <= ?";
      params.push(maxPrice);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id - Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /products - Create product
app.post("/products", async (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, description, price, category, stock, images } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, description, price, category, stock, images) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, price, category, stock, JSON.stringify(images)]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /products/:id - Update product
app.put("/products/:id", async (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, description, price, category, stock, images } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE products SET name=?, description=?, price=?, category=?, stock=?, images=? WHERE id=?",
      [name, description, price, category, stock, JSON.stringify(images), req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /products/:id - Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// ORDERS API
// ---------------------------

// POST /orders - Create Order
app.post("/orders", async (req, res) => {
  const { error } = orderSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { user_id, items } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'PENDING')",
      [user_id, total_amount]
    );
    const orderId = orderResult.insertId;

    const orderItems = items.map(item => [orderId, item.product_id, item.quantity, item.price]);
    await connection.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
      [orderItems]
    );

    await connection.query(
      "INSERT INTO order_history (order_id, status) VALUES (?, 'PENDING')",
      [orderId]
    );

    await connection.commit();
    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (err) {
    await connection.rollback();
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    connection.release();
  }
});

// GET /orders - Get User Orders
app.get("/orders", async (req, res) => {
  const { user_id } = req.query;
  try {
    let query = "SELECT * FROM orders";
    const params = [];
    if (user_id) {
      query += " WHERE user_id = ?";
      params.push(user_id);
    }
    query += " ORDER BY created_at DESC";
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /orders/:id - Get Order Details
app.get("/orders/:id", async (req, res) => {
  try {
    const [orderRows] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    if (orderRows.length === 0) return res.status(404).json({ error: "Order not found" });

    const [itemRows] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [req.params.id]);
    const [historyRows] = await pool.query("SELECT * FROM order_history WHERE order_id = ? ORDER BY changed_at DESC", [req.params.id]);

    res.json({ ...orderRows[0], items: itemRows, history: historyRows });
  } catch (err) {
    console.error("❌ Error fetching order details:", err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /orders/:id/status - Update Order Status
app.patch("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Order not found" });
    }

    await connection.query("INSERT INTO order_history (order_id, status) VALUES (?, ?)", [req.params.id, status]);

    await connection.commit();
    res.json({ message: "Order status updated", newStatus: status });
  } catch (err) {
    await connection.rollback();
    console.error("❌ Error updating status:", err);
    res.status(500).json({ error: "Failed to update status" });
  } finally {
    connection.release();
  }
});

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "E-commerce Backend (Products & Orders) Running 🚀" });
});

app.listen(port, () => {
  console.log(`🚀 Backend Server running on port ${port}`);
});
