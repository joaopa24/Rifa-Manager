const express = require('express')
const routes = express.Router()

const rifas = require("./rifas")
const users = require('./users')
const Compra = require('./compras')
const catalogo = require('./catalogo')

routes.use('/admin/rifas', rifas)
routes.use('/admin/users', users)
routes.use('/admin/compras', Compra)
routes.use('/admin/catalogo', catalogo)

routes.get("/", (req, res) => {
    res.redirect("/admin/users/login");
});

module.exports = routes
