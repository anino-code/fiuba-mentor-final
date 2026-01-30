import express from "express";
import cors from "cors";
import { pool, getAllUsers, getOneUser, createUser, deleteUser} from "./db.js";

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
app.get("/api/forms", (req, res) => {
  res.json({ status: 'OK'});
});

//GET. /FORMULARIOS/<NOMBRE>
app.get("/api/forms/:id_form", (req, res) => {
  res.json({ status: 'OK'});
});

//POST. /FORMULARIOS
app.post("/api/forms", (req, res) => {
  res.json({ status: 'OK'});
});

//DELETE. /FORMULARIOS/<NOMBRE>
app.delete("/api/forms/:id_form", (req, res) => {
  res.json({ status: 'OK'});
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