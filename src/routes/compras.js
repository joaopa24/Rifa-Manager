const express = require('express')
const routes = express.Router()

const compras = require('../app/controllers/ComprasController'); // Controller para compras
const multer = require('../app/middlewares/multer')
// Rotas para compras
routes.get("/", compras.index) // Listar todas as compras
routes.get("/criar", compras.create) // Página para criar uma nova compra
routes.get("/:id", compras.compra_admin) // Visualizar uma compra específica
routes.get("/:id/edit", compras.compra_admin_edit) // Página para editar uma compra, com verificação de proprietário
routes.post("/",multer.none(),compras.post) // Criar uma nova compra com upload de arquivos
routes.put("/", multer.none(),compras.put) // Editar uma compra existente com upload de novos arquivos
routes.delete("/", compras.delete)// Excluir uma compra
//routes.post("/comprar", compras.comprarBilhetes); // Nova rota para a compra de bilhetes

module.exports = routes;
