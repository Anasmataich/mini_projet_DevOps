import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'eshop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log(`🔌 Order Service connecting to database: ${process.env.DB_NAME || 'eshop_orders'} at ${process.env.DB_HOST || 'mysql'}`);

// Retry logic for MySQL connection
const retryConnection = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log("✅ Order Service connected to MySQL Database");
      connection.release();
      return true;
    } catch (err) {
      console.warn(`⏳ Retry ${i + 1}/${retries} - MySQL not ready yet...`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("❌ MySQL Connection Failed after retries:", err.message);
        return false;
      }
    }
  }
};

retryConnection();

export default pool;
