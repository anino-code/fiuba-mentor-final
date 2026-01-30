import express from "express";
import cors from "cors";
import { pool, getAllUsers, getOneUser} from "./db.js";

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
    res.status(500).json({ error: "Error al obtener usuarios" });
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
    res.status(500).json({ error: "Error al obtener usuario deseado" });
  }
});

//POST. /USUARIOS
app.post("/api/users", (req, res) => {
  res.json({ status: 'OK'});
});

//DELETE. /USUARIOS/<NOMBRE>
app.delete("/api/users/:id_user", (req, res) => {
  res.json({ status: 'OK'});
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