import pool from "./db.js";
import { products } from "../src/data/products.js"; // الملف الذي يحتوي على array المنتجات

async function insertProducts() {
  try {
    const query = `
      INSERT INTO products (id, name, description, price, image, category, stock, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const p of products) {
      await pool.query(query, [
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.category,
        p.stock,
        p.rating
      ]);
    }

    console.log("✅ All products inserted successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error inserting products:", err);
    process.exit(1);
  }
}

insertProducts();
