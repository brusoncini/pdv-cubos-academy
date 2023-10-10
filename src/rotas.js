const express = require("express");

const rotas = express();

rotas.post("/usuario");
rotas.post("/login");
rotas.get("/usuario");
rotas.put("/usuario");

module.exports = rotas;