const LoadCompraService = require('../services/LoadCompraService');

async function mostrarCatalogo(req, res) {
    try {
        // Carregar o catálogo de rifas disponíveis
        const rifas = await LoadCompraService.load('catalogo');

        // Renderizar a página de catálogo com as rifas
        res.render('Admin/catalogo/recipes', { rifas });
    } catch (error) {
        console.error('Erro ao exibir o catálogo:', error);
        res.status(500).send('Erro ao carregar o catálogo');
    }
}
async function comprarBilhetes(req, res) {
    const { rifa_id, quantity } = req.body;
    const client_id = req.user.id; // Supondo que você tem um middleware de autenticação

    try {
        // Verifica se a rifa existe
        const rifa = await db.query('SELECT * FROM rifas WHERE rifa_id = $1', [rifa_id]);
        if (rifa.rows.length === 0) {
            return res.status(404).send('Rifa não encontrada');
        }

        // Verifica se a quantidade é válida
        if (quantity <= 0 || quantity > rifa.rows[0].numerobilhetes) {
            return res.status(400).send('Quantidade inválida');
        }

        // Gera bilhetes aleatórios para a rifa
        const bilhetes = await BilheteService.getRandomBilhetes(rifa_id, quantity);

        // Cria a compra para os bilhetes gerados
        for (const bilhete of bilhetes) {
            await CompraService.create({ client_id, bilhete_id: bilhete.id, amount: 1, status: 'pending' }, rifa_id);
        }

        res.redirect('/compras'); // Redireciona para uma página de confirmação ou listagem de compras
    } catch (error) {
        console.error('Erro ao processar compra:', error.message);
        res.status(500).send('Erro ao processar compra');
    }
}



module.exports = {
    mostrarCatalogo,
    comprarBilhetes
};