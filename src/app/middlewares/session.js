const Rifa = require('../models/rifa')

function onlyUsers(req,res, next){
    if(!req.session.userId){
        return res.redirect('/admin/users/login')
    }
    next()
}

function forAdmin(req,res, next){
    if(req.session.isAdmin == false){

        return res.redirect('/admin/users/profile')
        
    }
    next()
}

async function onlyAdmin(req,res, next){
    if(!req.session.isAdmin){

        req.session.error = "Somente para administradores!"
        console.log('passou')
        
        return res.redirect('/admin/users/profile')
    }
    next()
}

function isLoggedRedirectToUsers(req, res, next){
    if(req.session.userId) {
        if(req.session.isAdmin){   
            return res.redirect('/admin/users')
        } else {
            return res.redirect('/admin/users/profile')
        }
    }

    next()
}

async function RecipeOwner(req,res, next){
    const rifa = await Rifa.find(req.params.id)
    console.log(rifa)
    if(req.session.userId !== rifa.client_id && req.session.isAdmin == false){
        req.session.error = "Você não é o dono dessa Receita!"
        return res.redirect('/admin/users/profile')
    }

    next()
}

function forAdmin(req,res, next){
    if(req.session.isAdmin == false){
        return res.redirect('/admin/users/profile')
    }
    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers,
    onlyAdmin,
    forAdmin,
    RecipeOwner
}