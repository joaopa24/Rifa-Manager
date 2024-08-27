const express = require('express')
const routes = express.Router()

const SiteController = require('../app/controllers/SiteController')

const recipes = require("./recipes")
const chefs = require("./chefs")
const users = require('./users')
const Compra = require('./compras')
const catalogo = require('./catalogo')

routes.use('/admin/Receitas', recipes)
routes.use('/admin/Chefs', chefs)
routes.use('/admin/users', users)
routes.use('/admin/compras', Compra)
routes.use('/admin/catalogo', catalogo)

//website - visit
routes.get("/", SiteController.home)

module.exports = routes
