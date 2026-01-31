import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function getAllUsers() {
  const result = await pool.query('SELECT u.*, COALESCE(SUM(r.aura), 0) AS aura FROM users u LEFT JOIN reviews r ON r.id_puntuado = u.id_user GROUP BY u.id_user');
  return result.rows;
}

export async function getOneUser(id_user) {
  const result = await pool.query('SELECT u.*, COALESCE(SUM(r.aura), 0) AS aura FROM users u LEFT JOIN reviews r ON r.id_puntuado = u.id_user WHERE id_user = $1 GROUP BY u.id_user LIMIT 1', [id_user]);
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
  const result = await pool.query('SELECT f.*, u.*, COALESCE(SUM(r.aura), 0) AS aura FROM forms f INNER JOIN users u ON f.id_user = u.id_user LEFT JOIN reviews r ON r.id_puntuado = u.id_user GROUP BY f.id_form, u.id_user');
  return result.rows.map(r => ({
    id_form: r.id_form,
    materia: r.materia,
    tema: r.tema,
    descripcion: r.descripcion,
    tipo: r.tipo,
    estado: r.estado,
    foto_form: r.foto_form,
    fecha_creado: r.fecha_creado,
    usuario: {
      id_user: r.id_user,
      nombre: r.nombre,
      apellido: r.apellido,
      carrera: r.carrera,
      email: r.email,
      foto_user: r.foto_user,
      aura: r.aura
    }
  }));
}

export async function getOneForm(id_form) {
  const result = await pool.query('SELECT f.*, u.*, COALESCE(SUM(r.aura), 0) AS aura FROM forms f INNER JOIN users u ON f.id_user = u.id_user LEFT JOIN reviews r ON r.id_puntuado = u.id_user WHERE id_form = $1 GROUP BY f.id_form, u.id_user LIMIT 1', [id_form]);
  if (result.rowCount === 0) {
    return undefined;
  }
  const r = result.rows[0];
  return {
    id_form: r.id_form,
    materia: r.materia,
    tema: r.tema,
    descripcion: r.descripcion,
    tipo: r.tipo,
    estado: r.estado,
    foto_form: r.foto_form,
    fecha_creado: r.fecha_creado,
    usuario: {
      id_user: r.id_user,
      nombre: r.nombre,
      apellido: r.apellido,
      carrera: r.carrera,
      email: r.email,
      foto_user: r.foto_user,
      aura: r.aura
    }
  };
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
  const result = await pool.query('SELECT r.*, pu.id_user AS puntuado_id, pu.nombre AS puntuado_nombre, pu.apellido AS puntuado_apellido, pu.carrera AS puntuado_carrera, pu.email AS puntuado_email, pu.foto_user AS puntuado_foto_user, pr.id_user AS puntuador_id, pr.nombre AS puntuador_nombre, pr.apellido AS puntuador_apellido, pr.carrera AS puntuador_carrera, pr.email AS puntuador_email, pr.foto_user AS puntuador_foto_user FROM reviews r JOIN users pu ON r.id_puntuado = pu.id_user JOIN users pr ON r.id_puntuador = pr.id_user');
  return result.rows.map(r => ({
    id_review: r.id_review,
    aura: r.aura,
    descripcion: r.descripcion,
    fecha_creado: r.fecha_creado,
    puntuado: {
      id_user: r.puntuado_id,
      nombre: r.puntuado_nombre,
      apellido: r.puntuado_apellido,
      carrera: r.puntuado_carrera,
      email: r.puntuado_email,
      foto_user: r.puntuado_foto_user
    },
    puntuador: {
      id_user: r.puntuador_id,
      nombre: r.puntuador_nombre,
      apellido: r.puntuador_apellido,
      carrera: r.puntuador_carrera,
      email: r.puntuador_email,
      foto_user: r.puntuador_foto_user
    }
  }));
}

export async function getOneReview(id_review) {
  const result = await pool.query('SELECT r.*, pu.id_user AS puntuado_id, pu.nombre AS puntuado_nombre, pu.apellido AS puntuado_apellido, pu.carrera AS puntuado_carrera, pu.email AS puntuado_email, pu.foto_user AS puntuado_foto_user, pr.id_user AS puntuador_id, pr.nombre AS puntuador_nombre, pr.apellido AS puntuador_apellido, pr.carrera AS puntuador_carrera, pr.email AS puntuador_email, pr.foto_user AS puntuador_foto_user FROM reviews r JOIN users pu ON r.id_puntuado = pu.id_user JOIN users pr ON r.id_puntuador = pr.id_user WHERE id_review = $1 LIMIT 1', [id_review]);
  if (result.rowCount === 0) {
    return undefined;
  }
  const r = result.rows[0];
  return {
    id_review: r.id_review,
    aura: r.aura,
    descripcion: r.descripcion,
    fecha_creado: r.fecha_creado,
    puntuado: {
      id_user: r.puntuado_id,
      nombre: r.puntuado_nombre,
      apellido: r.puntuado_apellido,
      carrera: r.puntuado_carrera,
      email: r.puntuado_email,
      foto_user: r.puntuado_foto_user
    },
    puntuador: {
      id_user: r.puntuador_id,
      nombre: r.puntuador_nombre,
      apellido: r.puntuador_apellido,
      carrera: r.puntuador_carrera,
      email: r.puntuador_email,
      foto_user: r.puntuador_foto_user
    }
  };
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
  const result = await pool.query('DELETE FROM reviews WHERE id_review = $1 RETURNING *', [id_review]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}