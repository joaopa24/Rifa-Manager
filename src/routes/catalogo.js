const express = require('express')
const routes = express.Router()

const catalogo = require('../app/controllers/ComprasController') // Controller para compras

// Rotas para compras
routes.get("/", catalogo.catalogo) // Listar todas as compras
routes.post("/comprar", catalogo.comprarBilhetes); // Nova rota para a compra de bilhetes

module.exports = routes
