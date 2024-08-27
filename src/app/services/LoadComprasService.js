const Compra = require('../models/compra')
const Rifa = require('../models/rifa')

const LoadCompraService = {
    filter: {},
    
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async compra() {
        try {
            const compra = await Compra.findOne(this.filter)
            return compra
        } catch (error) {
            console.error(error)
        }
    },
    async compras() {
        try {
            const compras = await Compra.findAll(this.filter)
            // Se não precisar formatar as compras, apenas retorne diretamente
            return compras
        } catch (error) {
            console.error(error)
        }
    },

    async catalogo() {
        try {
            // Adicione filtros conforme necessário. Aqui estamos carregando todas as rifas disponíveis para compra
            const rifas = await Rifa.findAll({});

            // Se precisar formatar as rifas, adicione a lógica de formatação aqui
            // Por exemplo: const rifasFormatadas = rifas.map(rifa => format(rifa));
            return rifas;

        } catch (error) {
            console.error('Erro ao carregar o catálogo de rifas:', error);
            return [];
        }
    }
}

module.exports = LoadCompraService
