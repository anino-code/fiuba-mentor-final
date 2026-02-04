import express from "express";
import cors from "cors";
import { pool, getAllUsers, getOneUser, createUser, deleteUser, updateUser, getAllForms, getOneForm, createForm, deleteForm, updateForm, getAllReviews, getOneReview, createReview, deleteReview, getReviewsUser} from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get("/api", (req, res) => {
  res.json({ status: "OK" });
});

//GET. /USUARIOS
app.get("/api/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error en GET /api/users:", error);
    res.status(500).json({ error: "DB users error" });
  }
});

//GET. /USUARIOS/<NOMBRE>
app.get("/api/users/:id_user", async (req, res) => {
  try {
    const idUser = Number(req.params.id_user);
    if (!Number.isInteger(idUser)) {
      return res.status(400).json({ error: "User invalido" });
    }
    const user = await getOneUser(idUser);
    if(!user) {
      return res.status(404).json({ error: "User no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error en GET /api/users/id_user/:", error);
    res.status(500).json({ error: "DB users error" });
  }
});

//POST. /USUARIOS
/*
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"nombre":"esteban","apellido":"ordoñez","carrera":"ing informatica","email":"eordonez@fi.uba.ar","foto_user":""}' \
  http://localhost:3000/api/users
*/
app.post("/api/users", async (req, res) => {
  try {
    if (req.body === undefined) {
      return res.status(400).json({ error: "Por favor completa el body." });
    }
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const carrera = req.body.carrera;
    const email = req.body.email;
    const foto_user = req.body.foto_user;
    if (!nombre || !apellido || !carrera || !email) {
      return res.status(400).json({ error: "Por favor completa todos los campos obligatorios." });
    }
    if (nombre.length > 20) {
      return res.status(400).json({ error: "Maximo nombre son 20 caracteres" });
    }
    if (apellido.length > 20) {
      return res.status(400).json({ error: "Maximo apellido son 20 caracteres" });
    }
    if (carrera.length > 100) {
      return res.status(400).json({ error: "Maximo carrera son 100 caracteres" });
    }
    if (email.length > 100) {
      return res.status(400).json({ error: "Maximo email son 100 caracteres" });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }
    const user = await createUser(nombre, apellido, carrera, email, foto_user)
    res.status(201).json(user);
  } catch (error) {
    console.error("Error en POST /api/users/:", error);
    res.status(500).json({ error: "Fallo al crear user" });
  }
});

//DELETE. /USUARIOS/<NOMBRE>
/*
curl --request DELETE http://localhost:3000/api/users/:id_user
*/
app.delete("/api/users/:id_user", async (req, res) => {
  try {
    const idUser = Number(req.params.id_user);
    if (!Number.isInteger(idUser)) {
      return res.status(400).json({ error: "User invalido" });
    }
    const user = await deleteUser(idUser);
    if(!user) {
      return res.status(404).json({ error: "User no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error en DELETE /api/users/id_user/:", error);
    res.status(500).json({ error: "DB users error" });
  }
});

//si uso pathch no necesito mandarle todo para actualizar, con put si
//PUT. /USUARIOS/<NOMBRE>
app.put("/api/users/:id_user", async (req, res) => {
  try {
    const idUser = Number(req.params.id_user);
    if (!Number.isInteger(idUser)) {
      return res.status(400).json({ error: "User invalido" });
    }
    if (req.body === undefined) {
      return res.status(400).json({ error: "Por favor completa el body." });
    }
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const carrera = req.body.carrera;
    const email = req.body.email;
    const foto_user = req.body.foto_user;
    if (!nombre || !apellido || !carrera || !email) {
      return res.status(400).json({ error: "Por favor completa todos los campos obligatorios." });
    }
    if (nombre.length > 20) {
      return res.status(400).json({ error: "Maximo nombre son 20 caracteres" });
    }
    if (apellido.length > 20) {
      return res.status(400).json({ error: "Maximo apellido son 20 caracteres" });
    }
    if (carrera.length > 100) {
      return res.status(400).json({ error: "Maximo carrera son 100 caracteres" });
    }
    if (email.length > 100) {
      return res.status(400).json({ error: "Maximo email son 100 caracteres" });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }
    const user = await updateUser(idUser, nombre, apellido, carrera, email, foto_user)
    if(!user) {
      return res.status(404).json({ error: 'User no encontrado'});
    }
    res.status(201).json(user);
  } catch (error) {
    console.error("Error en POST /api/users/:", error);
    res.status(500).json({ error: "Fallo al actualizar user" });
  }
});

//GET. /FORMULARIOS
app.get("/api/forms", async (req, res) => {
  try {
    const forms = await getAllForms();
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error en GET /api/forms:", error);
    res.status(500).json({ error: "DB forms error" });
  }
});

//GET. /FORMULARIOS/<NOMBRE>
app.get("/api/forms/:id_form", async (req, res) => {
  try {
    const idForm = Number(req.params.id_form);
    if (!Number.isInteger(idForm)) {
      return res.status(400).json({ error: "Form invalido" });
    }
    const form = await getOneForm(idForm);
    if(!form) {
      return res.status(404).json({ error: "Form no encontrado" });
    }
    res.status(200).json(form);
  } catch (error) {
    console.error("Error en GET /api/users/id_form/:", error);
    res.status(500).json({ error: "DB form error" });
  }
});

//POST. /FORMULARIOS
/*
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"id_user":7,"materia":"Intro","tema":"el back","descripcion":"hard","tipo":"mentor","foto_form":""}' \
  http://localhost:3000/api/forms
*/
app.post("/api/forms", async (req, res) => {
  try {
    if (req.body === undefined) {
      return res.status(400).json({ error: "Por favor completa el body." });
    }
    const id_user = req.body.id_user;
    const materia = req.body.materia;
    const tema = req.body.tema;
    const descripcion = req.body.descripcion;
    const tipo = req.body.tipo;
    const foto_form = req.body.foto_form;
    if (!id_user || !materia || !tema || !descripcion || !tipo) {
      return res.status(400).json({ error: "Por favor completa todos los campos obligatorios." });
    }
    if (!Number.isInteger(id_user)) {
      return res.status(400).json({ error: "ID User invalido" });
    }
    if (materia.length > 100) {
      return res.status(400).json({ error: "Maximo materia son 100 caracteres" });
    }
    if (tema.length > 100) {
      return res.status(400).json({ error: "Maximo tema son 100 caracteres" });
    }
    if (descripcion.length > 255) {
      return res.status(400).json({ error: "Maximo descripcion son 255 caracteres" });
    }
    if (tipo.length > 12) {
      return res.status(400).json({ error: "Maximo tipo son 12 caracteres" });
    }
    const form = await createForm(id_user, materia, tema, descripcion, tipo, foto_form)
    res.status(201).json(form);
  } catch (error) {
    console.error("Error en POST /api/forms/:", error);
    if (error.code === "23503") { 
      return res.status(400).json({ error: "id_user no existe" });
    }
    res.status(500).json({ error: "Fallo al crear form" });
  }
});

//DELETE. /FORMULARIOS/<NOMBRE>
app.delete("/api/forms/:id_form", async (req, res) => {
  try {
    const idForm = Number(req.params.id_form);
    if (!Number.isInteger(idForm)) {
      return res.status(400).json({ error: "ID Form invalido" });
    }
    const form = await deleteForm(idForm);
    if(!form) {
      return res.status(404).json({ error: "Form no encontrado" });
    }
    res.status(200).json(form);
  } catch (error) {
    console.error("Error en DELETE /api/forms/id_form/:", error);
    res.status(500).json({ error: "DB forms error" });
  }
});

//si uso pathch no necesito mandarle todo para actualizar, con put si
//PUT. /FORMULARIOS/<NOMBRE>
app.put("/api/forms/:id_form", async (req, res) => {
  try {
    const idForm = Number(req.params.id_form);
    if (!Number.isInteger(idForm)) {
      return res.status(400).json({ error: "ID Form invalido" });
    }
    if (req.body === undefined) {
      return res.status(400).json({ error: "Por favor completa el body." });
    }
    const id_user = req.body.id_user;
    const materia = req.body.materia;
    const tema = req.body.tema;
    const descripcion = req.body.descripcion;
    const tipo = req.body.tipo;
    const foto_form = req.body.foto_form;
    if (!id_user || !materia || !tema || !descripcion || !tipo) {
      return res.status(400).json({ error: "Por favor completa todos los campos obligatorios." });
    }
    if (!Number.isInteger(id_user)) {
      return res.status(400).json({ error: "ID User invalido" });
    }
    if (materia.length > 100) {
      return res.status(400).json({ error: "Maximo materia son 100 caracteres" });
    }
    if (tema.length > 100) {
      return res.status(400).json({ error: "Maximo tema son 100 caracteres" });
    }
    if (descripcion.length > 255) {
      return res.status(400).json({ error: "Maximo descripcion son 255 caracteres" });
    }
    if (tipo.length > 12) {
      return res.status(400).json({ error: "Maximo tipo son 12 caracteres" });
    }
    const form = await updateForm(idForm, id_user, materia, tema, descripcion, tipo, foto_form)
    if(!form) {
      return res.status(404).json({ error: "Form no encontrado" });
    }
    res.status(201).json(form);
  } catch (error) {
    console.error("Error en POST /api/forms/:", error);
    if (error.code === "23503") { 
      return res.status(400).json({ error: "id_user no existe" });
    }
    res.status(500).json({ error: "Fallo al actualizar form" });
  }
});

//GET. /REVIEWS
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error en GET /api/reviews:", error);
    res.status(500).json({ error: "DB reviews error" });
  }
});

//GET. /REVIEWS/<NOMBRE>
app.get("/api/reviews/:id_review", async (req, res) => {
    try {
    const idReview = Number(req.params.id_review);
    if (!Number.isInteger(idReview)) {
      return res.status(400).json({ error: "Review invalido" });
    }
    const review = await getOneReview(idReview);
    if(!review) {
      return res.status(404).json({ error: "Review no encontrado" });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error("Error en GET /api/reviews/id_review/:", error);
    res.status(500).json({ error: "DB reviews error" });
  }
});

//GET. /REVIEWS/<USER>
app.get("/api/reviewsUser/:id_user", async (req, res) => {
    try {
    const idUser = Number(req.params.id_user);
    if (!Number.isInteger(idUser)) {
      return res.status(400).json({ error: "User invalido" });
    }
    const user = await getReviewsUser(idUser);
    if(!user) {
      return res.status(404).json({ error: "User no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error en GET /api/reviewsUser/id_user/:", error);
    res.status(500).json({ error: "DB reviews error" });
  }
});

//POST. /REVIEWS
/*
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"id_puntuado":1,"id_puntuador":9,"aura":10,"descripcion":"descripcion"}' \
  http://localhost:3000/api/reviews
*/
app.post("/api/reviews", async (req, res) => {
  try {
    if (req.body === undefined) {
      return res.status(400).json({ error: "Por favor completa el body."});
    }
    const id_puntuado = req.body.id_puntuado;
    const id_puntuador = req.body.id_puntuador;
    const aura = req.body.aura;
    const descripcion = req.body.descripcion;
    if (!Number.isInteger(id_puntuado)) {
      return res.status(400).json({ error: "ID Puntuado invalido" });
    }
    if (!Number.isInteger(id_puntuador)) {
      return res.status(400).json({ error: "ID Puntuador invalido" });
    }
    if (!Number.isInteger(aura)) {
      return res.status(400).json({ error: "Aura invalido" });
    }
    if (descripcion.length > 255) {
      return res.status(400).json({ error: "Maximo descripcion son 255 caracteres" });
    }
    if (!id_puntuado || !id_puntuador || !aura || !descripcion) {
      return res.status(400).json({ error: "Por favor completa todos los campos obligatorios." });
    }
    const review = await createReview(id_puntuado, id_puntuador, aura, descripcion)
    res.status(201).json(review);
  } catch (error) {
    console.error("Error en POST /api/reviews/:", error);
    if (error.code === "23503") { 
      return res.status(400).json({ error: "Algun ID no existe" });
    }
    res.status(500).json({ error: "Fallo al crear review" });
  }
});

//DELETE. /REVIEWS/<NOMBRE>
app.delete("/api/reviews/:id_review", async (req, res) => {
  try {
    const idReview = Number(req.params.id_review);
    if (!Number.isInteger(idReview)) {
      return res.status(400).json({ error: "Review invalido" });
    }
    const review = await deleteReview(idReview);
    if(!review) {
      return res.status(404).json({ error: "Review no encontrado" });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error("Error en DELETE /api/reviews/id_review/:", error);
    res.status(500).json({ error: "DB reviews error" });
  }
});

//si uso pathch no necesito mandarle todo para actualizar, con put si
//PUT. /REVIEWS/<NOMBRE>
app.put("/api/reviews/:id_review", (req, res) => {
  res.json({ status: 'OK'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});