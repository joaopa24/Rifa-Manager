const Compra = require("../models/compra") // Modelo para compras
const File = require("../models/file") // Modelo para arquivos, caso precise de anexos
const Rifa = require("../models/rifa")
const Bilhete = require("../models/Bilhete")
const LoadComprasService = require('../services/LoadComprasService') // Serviço para carregar compras

module.exports = {
    async index(req, res) {
        try {
            const compras = await LoadComprasService.load('compras') // Carregar todas as compras
    
            return res.render("Admin/compras/index", { compras }) // Renderizar a página de índice com as compras
            
        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res) {
        return res.render("Admin/compras/create") // Renderizar página de criação
    },
    async compra_admin(req, res) {
        console.log(req.params.id)
        const compra = await LoadComprasService.load('compra', {
            where: { compra_id: req.params.id } // Carregar compra específica pelo ID
        })
        console.log(compra)
        return res.render("Admin/compras/edit", { compra }) // Renderizar página da compra específica
    },
    async compra_admin_edit(req, res) {
        const compra = await LoadComprasService.load('compra', {
            where: { id: req.params.id } // Carregar compra específica para edição
        })
        
        if (!compra) return res.send("Compra não encontrada") // Verificar se a compra existe

        return res.render("Admin/compras/edit", { compra }) // Renderizar página de edição
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        console.log(keys)
        for (const key of keys) {
            if (req.body[key] === "")
                return res.send("Por favor preencha todos os campos!") // Validar campos
        }
        const compra_id = await Compra.create(req.body) // Criar nova compra
      
        return res.redirect(`/admin/compras/`) // Redirecionar para a página da compra criada
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (const key of keys) {
            if (req.body[key] === "" && key !== "removed_files" && key !== "photos") {
                return res.send("Por favor, preencha todos os campos!") // Validar campos
            }
        }

        await Compra.update(req.body) // Atualizar a compra

        return res.redirect(`/admin/compras/${req.body.id}`) // Redirecionar para a página da compra atualizada
    },
    async delete(req, res) {
        const { id } = req.body

        await Compra.delete(id) // Excluir a compra

        return res.redirect("/admin/compras") // Redirecionar para a página de índice de compras
    },

    async catalogo(req, res) {
        try {
            // Carregar o catálogo de rifas disponíveis
            const rifas = await LoadComprasService.load('catalogo');
    
            // Renderizar a página de catálogo com as rifas
            res.render('Admin/catalogo/index', { rifas });
        } catch (error) {
            console.error('Erro ao exibir o catálogo:', error);
            res.status(500).send('Erro ao carregar o catálogo');
        }
    },
    async getAvailableBilhetes(rifa_id, quantity) {
    // Seleciona todos os bilhetes disponíveis
    const { rows } = await db.query('SELECT id_bilhete FROM bilhetes WHERE id_rifa = $1 AND status = false', [rifa_id]);

    // Embaralha os bilhetes e seleciona a quantidade necessária
    const shuffledBilhetes = rows.sort(() => 0.5 - Math.random());
    return shuffledBilhetes.slice(0, quantity);
    },
    
    async comprarBilhetes(req, res) {
        const { rifa_id, quantity } = req.body;
        const client_id = req.body.id; // Supondo que você tem um middleware de autenticação
    
        // Verifica se rifa_id e quantity são válidos
        if (!Number.isInteger(Number(rifa_id)) || !Number.isInteger(Number(quantity))) {
            return res.status(400).send('ID da rifa ou quantidade inválidos');
        }
    
        try {
            // Verifica se a rifa existe
            const rifa = await Rifa.findOne(rifa_id); // Usa o método findById do modelo Rifa
            console.log(rifa)
            if (!rifa) {
                return res.status(404).send('Rifa não encontrada');
            }
    
            // Verifica se a quantidade é válida
            if (quantity <= 0 || quantity > rifa.numeroBilhetes) {
                return res.status(400).send('Quantidade inválida');
            }
    
            // Seleciona os bilhetes disponíveis
            const availableBilhetes = await Bilhete.findBilhetes(rifa_id); // Usa o método findBilhetes do modelo Bilhete
    
            // Filtra bilhetes disponíveis
            const availableBilhetesAvailable = availableBilhetes.filter(b => !b.status);
            if (availableBilhetesAvailable.length < quantity) {
                return res.status(400).send('Não há bilhetes suficientes disponíveis');
            }
    
            // Cria a compra para cada bilhete selecionado
            const createCompraPromises = availableBilhetesAvailable.slice(0, quantity).map(async (bilhete) => {
                await Compra.create({
                    client_id,
                    bilhete_id: bilhete.id_bilhete,
                    amount: 1,
                    status: 'pending'
                });
    
                // Marca o bilhete como comprado
                await Bilhete.update({ id_bilhete: bilhete.id_bilhete, status: true }); // Usa o método update do modelo Bilhete
            });
    
            // Aguarda a criação de todas as compras
            await Promise.all(createCompraPromises);
    
            res.redirect('/admin/compras'); // Redireciona para a página de listagem de compras
        } catch (error) {
            console.error('Erro ao processar compra:', error.message);
            res.status(500).send('Erro ao processar compra');
        }
    }
    
}
