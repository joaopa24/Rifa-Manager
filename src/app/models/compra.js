const db = require('../../config/db')
const Base = require('./base')

// Inicialize o modelo Base com a tabela 'Compra'
Base.init({ table: 'compra' })

module.exports = {
    ...Base,

    async findById(id) {
        try {
            const results = await db.query(`
                SELECT * FROM "compra"
                WHERE "compra_id" = $1
            `, [id])

            return results.rows[0]

        } catch (error) {
            console.error(error)
        }
    },

    async findAll() {
        try {
            const results = await db.query(`
                SELECT * FROM "compra"
                ORDER BY "created_at" DESC
            `)

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },

    async create(data) {
        try {
            const query = `
                INSERT INTO "compra" (
                    "client_id",
                    "bilhete_id",
                    "created_at",
                    "amount",
                    "status"
                ) VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)
                RETURNING "compra_id"
            `;
    
            const values = [
                data.client_id,  // Use o ID do usuário
                data.bilhete_id,
                data.amount,
                data.status
            ];
    
            const results = await db.query(query, values);
            return results.rows[0].compra_id;
        } catch (error) {
            console.error("Erro ao criar compra:", error.message);
            throw error;  // Propaga o erro para que a chamada externa possa lidar com ele
        }
    },

    async update(data) {
        try {
            const { compra_id, client_id, bilhete_id, amount, status } = data
            await db.query(`
                UPDATE "compra"
                SET "client_id" = $1, "bilhete_id" = $2, "amount" = $3, "status" = $4
                WHERE "compra_id" = $5
            `, [client_id, bilhete_id, amount, status, compra_id])

        } catch (error) {
            console.error(error)
        }
    },

    async delete(id) {
        try {
            await db.query(`
                DELETE FROM "compra"
                WHERE "compra_id" = $1
            `, [id])

        } catch (error) {
            console.error(error)
        }
    }
}
