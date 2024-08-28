const express = require('express')
const routes = express.Router()

const { RecipeOwner } = require('../app/middlewares/session')

const multer = require('../app/middlewares/multer')
const rifas = require('../app/controllers/RifasController')

routes.get("/", rifas.index)
routes.get("/criar", rifas.create)
routes.get("/:id", multer.array("photos", 1),rifas.rifa_admin)
routes.get("/:id/edit",multer.array("photos", 1),RecipeOwner, rifas.rifa_admin_edit)
routes.post("/", multer.array("photos", 1),rifas.post)
routes.put("/", multer.array("photos", 1),rifas.put)
routes.delete("/", rifas.delete)

module.exports = routes