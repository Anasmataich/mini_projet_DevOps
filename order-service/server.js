import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import initDb from './initDb.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
    res.json({ message: "Order Service is running 🚀" });
});

import { validateUser, getPaymentStatus } from './utils/api.js';

// ---------------------------
// Create Order
// ---------------------------
app.post('/orders', async (req, res) => {
    const { user_id, items } = req.body;
    const token = req.headers.authorization;

    if (!user_id || !items || items.length === 0) {
        return res.status(400).json({ error: "Invalid request data" });
    }

    // Validate User
    const isValidUser = await validateUser(user_id, token);
    if (!isValidUser) {
        return res.status(401).json({ error: "Invalid or unauthorized user" });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Calculate total amount (assuming price is passed in items for now, ideally fetched from Product Service)
        const total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Insert Order
        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'PENDING')",
            [user_id, total_amount]
        );
        const orderId = orderResult.insertId;

        // Insert Order Items
        const orderItems = items.map(item => [orderId, item.product_id, item.quantity, item.price]);
        await connection.query(
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
            [orderItems]
        );

        // Insert History
        await connection.query(
            "INSERT INTO order_history (order_id, status) VALUES (?, 'PENDING')",
            [orderId]
        );

        await connection.commit();
        res.status(201).json({ message: "Order created successfully", orderId });
    } catch (error) {
        await connection.rollback();
        console.error("❌ Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" });
    } finally {
        connection.release();
    }
});

// ---------------------------
// Get User Orders
// ---------------------------
app.get('/orders', async (req, res) => {
    const { user_id } = req.query;
    try {
        let query = "SELECT * FROM orders";
        let params = [];
        if (user_id) {
            query += " WHERE user_id = ?";
            params.push(user_id);
        }
        query += " ORDER BY created_at DESC";

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// ---------------------------
// Get Order Details
// ---------------------------
app.get('/orders/:id', async (req, res) => {
    try {
        const [orderRows] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
        if (orderRows.length === 0) return res.status(404).json({ error: "Order not found" });

        const [itemRows] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [req.params.id]);
        const [historyRows] = await pool.query("SELECT * FROM order_history WHERE order_id = ? ORDER BY changed_at DESC", [req.params.id]);

        res.json({ ...orderRows[0], items: itemRows, history: historyRows });
    } catch (error) {
        console.error("❌ Error fetching order details:", error);
        res.status(500).json({ error: "Failed to fetch order details" });
    }
});

// ---------------------------
// Update Order Status
// ---------------------------
app.patch('/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check if order exists
        const [orderRows] = await connection.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
        if (orderRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Order not found" });
        }
        const currentOrder = orderRows[0];

        // Payment Validation before Shipping
        if (status === 'SHIPPED') {
            const paymentStatus = await getPaymentStatus(req.params.id);
            if (paymentStatus !== 'COMPLETED' && paymentStatus !== 'PAID') { // Assuming Payment Service returns COMPLETED or PAID
                // For now, if payment service is mocked or returns something else, we might want to be careful.
                // But let's enforce it if not in mock mode.
                if (process.env.MOCK_SERVICES !== 'true' && paymentStatus !== 'PAID') {
                    await connection.rollback();
                    return res.status(400).json({ error: "Cannot ship order. Payment not verified." });
                }
            }
        }

        const [result] = await connection.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);

        await connection.query("INSERT INTO order_history (order_id, status) VALUES (?, ?)", [req.params.id, status]);

        await connection.commit();
        res.json({ message: "Order status updated", oldStatus: currentOrder.status, newStatus: status });
    } catch (error) {
        await connection.rollback();
        console.error("❌ Error updating status:", error);
        res.status(500).json({ error: "Failed to update status" });
    } finally {
        connection.release();
    }
});

// ---------------------------
// Cancel Order
// ---------------------------
app.delete('/orders/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query("UPDATE orders SET status = 'CANCELLED' WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Order not found" });
        }

        await connection.query("INSERT INTO order_history (order_id, status) VALUES (?, 'CANCELLED')", [req.params.id]);

        await connection.commit();
        res.json({ message: "Order cancelled" });
    } catch (error) {
        await connection.rollback();
        console.error("❌ Error cancelling order:", error);
        res.status(500).json({ error: "Failed to cancel order" });
    } finally {
        connection.release();
    }
});

// Initialize DB and Start Server (but don't auto-start in test environment)
const start = async () => {
    await initDb();
    app.listen(port, () => {
        console.log(`🚀 Order Service running on port ${port}`);
    });
};

if (process.env.NODE_ENV !== 'test') {
    start();
}

export default app;
