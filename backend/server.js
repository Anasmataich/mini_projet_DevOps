import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 5000;

// ---------------------------
// CORS pour le frontend
// ---------------------------
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// ---------------------------
// Route test
// ---------------------------
app.get("/", (req, res) => {
  res.json({ message: "API E-commerce fonctionne avec MySQL ✅" });
});

// ---------------------------
// GET all products
// ---------------------------
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    console.log("📦 Produits récupérés:", rows.length);
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur produits:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// GET product by ID
// ---------------------------
app.get("/products/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      console.log("⚠️ Produit non trouvé:", req.params.id);
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    console.log("📦 Produit récupéré:", rows[0].name);
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Erreur produit:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// Démarrage
// ---------------------------
app.listen(port, () => {
  console.log("🚀 Serveur backend MySQL: http://localhost:5000");
  console.log("📡 Frontend autorisé: http://localhost:5173");
});
