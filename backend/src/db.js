import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function getAllUsers() {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
}