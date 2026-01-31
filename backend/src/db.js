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

export async function getOneUser(id_user) {
  const result = await pool.query('SELECT * FROM users WHERE id_user = $1 LIMIT 1', [id_user]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

export async function createUser(nombre, apellido, carrera, email, foto_user) {
  const result = await pool.query('INSERT INTO  users(nombre, apellido, carrera, email, foto_user) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nombre, apellido, carrera, email, foto_user]);
  console.log("result", result.rows[0]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

export async function deleteUser(id_user) {
  const result = await pool.query('DELETE FROM users WHERE id_user = $1 RETURNING *', [id_user]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

export async function getAllForms() {
  const result = await pool.query('SELECT * FROM forms');
  return result.rows;
}

export async function getOneForm(id_form) {
  const result = await pool.query('SELECT * FROM forms WHERE id_form = $1 LIMIT 1', [id_form]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

export async function createForm(id_user, materia, tema, descripcion, tipo, foto_form) {
  const result = await pool.query('INSERT INTO forms(id_user, materia, tema, descripcion, tipo, foto_form) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id_user, materia, tema, descripcion, tipo, foto_form]);
  console.log("result", result.rows[0]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

export async function deleteForm(id_form) {
  const result = await pool.query('DELETE FROM forms WHERE id_form = $1 RETURNING *', [id_form]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

export async function getAllReviews() {
  const result = await pool.query('SELECT * FROM reviews');
  return result.rows;
}

export async function getOneReview(id_review) {
  const result = await pool.query('SELECT * FROM reviews WHERE id_reviews = $1 LIMIT 1', [id_review]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

export async function createReview(id_puntuado, id_puntuador, aura, descripcion) {
  const result = await pool.query('INSERT INTO  reviews(id_puntuado, id_puntuador, aura, descripcion) VALUES ($1, $2, $3, $4) RETURNING *', [id_puntuado, id_puntuador, aura, descripcion]);
  console.log("result", result.rows[0]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

export async function deleteReview(id_review) {
  const result = await pool.query('DELETE FROM reviews WHERE id_reviews = $1 RETURNING *', [id_review]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}