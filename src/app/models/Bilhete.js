const db = require('../../config/db')
const Base = require('./base')

// Inicializa o modelo Bilhete
Base.init({ table: 'bilhete' })

module.exports = {
    ...Base,

    // Método para criar um novo bilhete
    async create(data, rifa_id) {
        try {
            // Verifica se a rifa existe
            const rifaExists = await db.query(`
                SELECT 1 FROM rifas WHERE rifa_id = $1
            `, [rifa_id]);

            if (rifaExists.rows.length === 0) {
                throw new Error('Rifa não encontrada. Não é possível criar o bilhete.');
            }

            const query = `
                INSERT INTO bilhete (
                    id_rifa,
                    name,
                    status,
                    created_at
                ) VALUES ($1, $2, $3, $4)
                RETURNING id_bilhete
            `

            const values = [
                rifa_id,
                data.name,
                false,
                new Date()  // Insere a data atual para created_at
            ]

            const results = await db.query(query, values)
            return results.rows[0].id_bilhete

        } catch (error) {
            console.error("Erro ao criar bilhete:", error.message)
            throw error  // Propaga o erro para que a chamada externa possa lidar com ele
        }
    },

    // Método para encontrar bilhetes por rifa
    async findBilhetes(id_rifa) {
        try {
            const results = await db.query(`
                SELECT * FROM bilhete
                WHERE id_rifa = $1
                ORDER BY id_bilhete ASC
            `, [id_rifa])

            return results.rows

        } catch (error) {
            console.error("Erro ao buscar bilhetes:", error.message)
            throw error
        }
    },

    // Método para contar o total de bilhetes por rifa
    async totalBilhetes() {
        try {
            const results = await db.query(`
                SELECT rifas.*, COUNT(bilhete.id_bilhete) AS total_bilhetes
                FROM rifas
                LEFT JOIN bilhete ON (rifas.rifa_id = bilhete.id_rifa)
                GROUP BY rifas.rifa_id
                ORDER BY total_bilhetes DESC
            `)

            return results.rows

        } catch (error) {
            console.error("Erro ao contar bilhetes:", error.message)
            throw error
        }
    },
    async findBilhetes(id_rifa) {
        if (!Number.isInteger(Number(id_rifa))) {
            throw new Error('ID da rifa inválido');
        }
        try {
            const results = await db.query(`
                SELECT * FROM bilhete
                WHERE id_rifa = $1
                ORDER BY id_bilhete ASC
            `, [id_rifa]);
    
            return results.rows;
    
        } catch (error) {
            console.error("Erro ao buscar bilhetes:", error.message);
            throw error;
        }
    }
}
