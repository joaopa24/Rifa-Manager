const { unlinkSync } = require('fs')
const { hash } = require('bcryptjs')
const User = require('../models/user')
const Rifa = require('../models/rifa')
const mailer = require('../../lib/mailer')

module.exports = {
    async list(req, res) {
        try {
            const isAdmin = req.session.isAdmin
            const users = await User.findAll()

            const user = req.session.userId.id

            const error = req.session.error

            return res.render("Admin/user/index.njk", { isAdmin,users, user, error })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            const { id } = req.params

            const user = await User.find(id)

            const error = req.session.error

            return res.render('Admin/user/edit.njk', { user, error })
        } catch (error) {
            console.error(error)
        }
    },
    registerForm(req, res) {
        return res.render("Admin/user/register.njk")
    },
    cadastroForm(req, res) {
        return res.render("Admin/session/register.njk")
    },
    async show(req, res) {
        try {
            const userId = await User.find(req.session.userId)

            const error = req.session.error
            req.session.error = "";

            return res.render('Admin/user/show.njk', { user: userId, error })
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        console.log(req.body)
        try {
            
            const newPassword = await hash(req.body.password, 10)
            const userId = await User.create(req.body,newPassword)
            
            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@Foodfy.com',
                subject: 'Cadastrado Foodfy',
                html: `<h2>Cadastrado Foodfy</h2>
                <p>Cadastrado Concluido!</p>
                <p>
                   A senha da sua conta é ${req.body.password}
                </p>
                `
            })

            req.session.userId = userId

            return res.redirect(`/admin/users/login`)
        } catch (error) {
            console.error(error)
        }
    },
    async update(req, res) {
        try {
            const { user } = req
            console.log(req.body)
            let { name, email, is_admin, cpf, celular } = req.body

            await User.update(user.id, {
                name,
                email,
                is_admin,
                cpf,
                celular
            })

            return res.redirect('/admin/users')
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        try {
            const rifas = await Rifa.findAll({where:{user_id:req.body.id}})
            
            const allFilesPromise = rifas.map(rifas => Rifa.files(rifa.id))
              
            let promiseResults = await Promise.all(allFilesPromise)
    
            User.delete(req.body.id)
            //req.session.destroy()
            const users = await User.findAll() 
            promiseResults.map(files => {
                files.map(file =>{
                    try{
                        unlinkSync(file.path)
                    } catch(err){
                        console.error(err)
                    }
                })
            })
            return res.render("Admin/user/index.njk", {
                sucess:"Conta Deletada com sucesso",
                users
            })
        } catch (error) {
            return res.render("/admin/users/",{
                user: req.body,
                error:"Erro ao tentar deletar sua conta!"
            })
        }
    }
}