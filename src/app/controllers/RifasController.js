const Rifa = require("../models/rifa");
const File = require("../models/file");
const Bilhete = require("../models/Bilhete");  // Modelo de Ticket
const LoadRifaService = require('../services/LoadRecipeService');  // Atualize este serviço conforme necessário

module.exports = {
    async index(req, res) {
        try {
            const isAdmin = req.session.isAdmin
            let rifas 
            if(req.session.isAdmin == true){
              rifas = await LoadRifaService.load('rifas');  
            } 
            if(req.session.isAdmin == false) {
              rifas = await LoadRifaService.load('rifas',{
                where: {client_id: req.session.userId}
              })
            }
            console.log(rifas)
 
            return res.render("Admin/rifas/index", { rifas, isAdmin});
        } catch (error) {
            console.error("Erro ao carregar rifas:", error);
            return res.status(500).send("Erro ao carregar rifas.");
        }
    },

    async create(req, res) {
        return res.render("Admin/rifas/create");
    },

    async rifa_admin(req, res) {
        try {
            const rifa = await LoadRifaService.load('rifa', {
                where: { rifa_id: req.params.id }
            });

            if (!rifa) {
                return res.status(404).send("Rifa não encontrada");
            }
            return res.render("Admin/rifas/recipe", { rifa, files: rifa.files });
        } catch (error) {
            console.error("Erro ao carregar rifa:", error);
            return res.status(500).send("Erro ao carregar rifa.");
        }
    },

    async rifa_admin_edit(req, res) {
        try {
            const rifa = await LoadRifaService.load('rifa', {
                where: { rifa_id: req.params.id }
            });
            if (!rifa) return res.status(404).send("Rifa não encontrada");
            return res.render("Admin/rifas/edit", { rifa, files: rifa.files });
        } catch (error) {
            console.error("Erro ao carregar rifa para edição:", error);
            return res.status(500).send("Erro ao carregar rifa para edição.");
        }
    },

   // Em seu controlador, verifique se os IDs estão sendo passados corretamente
   async post(req, res) {
    let userRecipe = req.session.userId
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "")
            return res.send("Porfavor preencha todos os campos!")
    }

    if (req.files.length == 0) {
        return res.send('Porfavor pelo menos uma imagem!')
    }
    
    const recipe_id = await Rifa.create(req.body, userRecipe)


    const filesPromise = req.files.map(file => File.create({ ...file }))
    const filesResults = await Promise.all(filesPromise)
    const recipeFiles = filesResults.map(files => {
        const file_id = files.rows[0].id
        File.RecipeFiles({ recipe_id, file_id })
    })

    await Promise.all(recipeFiles)

    // Cria os bilhetes
    
    const numeroBilhetes = req.body.numeroBilhetes;  // Certifique-se de que este campo está no formulário
    for (let i = 0; i < numeroBilhetes; i++) {
        Bilhete.create(req.body, recipe_id)
    }

    return res.redirect(`/admin/rifas/${recipe_id}`)
},
    async put(req, res) {
        console.log(req.body) 
        try {
            const keys = Object.keys(req.body);
            console.log(req.body) 
            for (let key of keys) {
                if (req.body[key] === "" && key !== "removed_files" && key !== "photos") {
                    return res.status(400).send("Por favor, preencha todos os campos");
                }
            }
           
            if (req.files && req.files.length > 0) {
                const oldFiles = await Rifa.files(req.body.id);
                const totalFiles = oldFiles.length + req.files.length;
                console.log(req.files)
                if (totalFiles <= 6) {
                    const rifaId = req.body.id;
                    console.log(rifaId)
                    const newFilesPromises = req.files.map(file => File.create({ ...file }));
                    const filesResults = await Promise.all(newFilesPromises);
                    console.log(filesResults)
                    const rifaFilesPromises = filesResults.map(files => {
                        const fileId = files.rows[0].id;
                        console.log(fileId)
                        return File.RecipeFiles({ recipe_id: rifaId, file_id: fileId });
                    });
                    await Promise.all(rifaFilesPromises);
                }
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",");
                removedFiles.pop(); // Remove o último item se necessário

                const removedFilesPromises = removedFiles.map(file => File.delete(file));
                await Promise.all(removedFilesPromises);
            }
            await Rifa.update(req.body);
            return res.redirect(`/admin/rifas/${req.body.id}`);
        } catch (error) {
            console.error("Erro ao atualizar a rifa:", error);
            return res.status(500).send("Erro ao atualizar a rifa.");
        }
    },

    async delete(req, res) {
        try {
            console.log(req.body.id)
            // Implementa a funcionalidade de exclusão se necessário
            await Rifa.delete(req.body.id);
            console.log(req.body)  
            return res.redirect("/admin/rifas");
        } catch (error) {
            console.error("Erro ao excluir a rifa:", error);
            return res.status(500).send("Erro ao excluir a rifa.");
        }
    }
}
