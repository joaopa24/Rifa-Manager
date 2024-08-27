const express = require('express')
const routes = express.Router()

const { RecipeOwner } = require('../app/middlewares/session')

const multer = require('../app/middlewares/multer')
const recipes = require('../app/controllers/RecipesController')

routes.get("/", recipes.index)
routes.get("/criar", recipes.create)
routes.get("/:id", multer.array("photos", 1),recipes.rifa_admin)
routes.get("/:id/edit",multer.array("photos", 1),RecipeOwner, recipes.rifa_admin_edit)
routes.post("/", multer.array("photos", 1),recipes.post)
routes.put("/", multer.array("photos", 1),recipes.put)
routes.delete("/", recipes.delete)

module.exports = routes