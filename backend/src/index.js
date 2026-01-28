import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {

});

//GET. /FORMULARIOS
app.get("/forms", (req, res) => {

});

//GET. /FORMULARIOS/<NOMBRE>
app.get("/forms/:id_form", (req, res) => {

});

//POST. /FORMULARIOS
app.post("/forms", (req, res) => {

});

//DELETE. /FORMULARIOS/<NOMBRE>
app.delete("/forms/:id_form", (req, res) => {

});

//si uso pathch no necesito mandarle todo para actualizar, con put si
//PUT. /FORMULARIOS/<NOMBRE>
app.put("/forms/:id_form", (req, res) => {

});

//GET. /USUARIOS
app.get("/users", (req, res) => {

});

//GET. /USUARIOS/<NOMBRE>
app.get("/users/:id_user", (req, res) => {

});

//POST. /USUARIOS
app.post("/users", (req, res) => {

});


//DELETE. /USUARIOS/<NOMBRE>
app.delete("/users/:id_user", (req, res) => {

});

//si uso pathch no necesito mandarle todo para actualizar, con put si
//PUT. /USUARIOS/<NOMBRE>
app.put("/users/:id_user", (req, res) => {

});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});