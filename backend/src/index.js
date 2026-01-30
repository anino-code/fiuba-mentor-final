import express from "express";
import cors from "cors";
import { pool, getAllUsers, getOneUser, createUser, deleteUser, getAllForms, getOneForm, createForm, deleteForm } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get("/api", (req, res) => {
  res.json({ status: 'OK'});
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
      return res.status(404).json({ error: 'User no encontrado'});
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
      return res.status(400).json({ error: 'Por favor completa el body.'});
    }
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const carrera = req.body.carrera;
    const email = req.body.email;
    const foto_user = req.body.foto_user;

    if (!nombre || !apellido || !carrera || !email) {
      return res.status(400).json({ error: 'Por favor completa todos los campos obligatorios.'});
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }
    const user = await createUser(nombre, apellido, carrera, email, foto_user)
    res.status(201).json(user);
  } catch (error) {
    console.error("Error en POST /api/users/:", error);
    res.status(500).json({ error: 'Fallo al crear user' });
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
      return res.status(404).json({ error: 'User no encontrado'});
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error en DELETE /api/users/id_user/:", error);
    res.status(500).json({ error: "DB users error" });
  }
});

//si uso pathch no necesito mandarle todo para actualizar, con put si
//PUT. /USUARIOS/<NOMBRE>
app.put("/api/users/:id_user", (req, res) => {
  res.json({ status: 'OK'});
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
      return res.status(404).json({ error: 'Form no encontrado'});
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
      return res.status(400).json({ error: 'Por favor completa el body.'});
    }
    const id_user = req.body.id_user;
    const materia = req.body.materia;
    const tema = req.body.tema;
    const descripcion = req.body.descripcion;
    const tipo = req.body.tipo;
    const foto_form = req.body.foto_form;
    if (!id_user || !materia || !tema || !descripcion || !tipo) {
      return res.status(400).json({ error: 'Por favor completa todos los campos obligatorios.'});
    }
    const form = await createForm(id_user, materia, tema, descripcion, tipo, foto_form)
    res.status(201).json(form);
  } catch (error) {
    console.error("Error en POST /api/forms/:", error);
    res.status(500).json({ error: 'Fallo al crear form' });
  }
});

//DELETE. /FORMULARIOS/<NOMBRE>
app.delete("/api/forms/:id_form", async (req, res) => {
  try {
    const idForm = Number(req.params.id_form);
    if (!Number.isInteger(idForm)) {
      return res.status(400).json({ error: "Form invalido" });
    }
    const form = await deleteForm(idForm);
    if(!form) {
      return res.status(404).json({ error: 'Form no encontrado'});
    }
    res.status(200).json(form);
  } catch (error) {
    console.error("Error en DELETE /api/forms/id_form/:", error);
    res.status(500).json({ error: "DB forms error" });
  }
});

//si uso pathch no necesito mandarle todo para actualizar, con put si
//PUT. /FORMULARIOS/<NOMBRE>
app.put("/api/forms/:id_form", (req, res) => {
  res.json({ status: 'OK'});
});

//GET. /REVIEWS
app.get("/api/reviews", (req, res) => {
  res.json({ status: 'OK'});
});

//GET. /REVIEWS/<NOMBRE>
app.get("/api/reviews/:id_review", (req, res) => {
  res.json({ status: 'OK'});
});

//POST. /REVIEWS
app.post("/api/reviews", (req, res) => {
  res.json({ status: 'OK'});
});

//DELETE. /REVIEWS/<NOMBRE>
app.delete("/api/reviews/:id_review", (req, res) => {
  res.json({ status: 'OK'});
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