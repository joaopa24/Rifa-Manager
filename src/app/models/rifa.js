const db = require('../../config/db')
const { date } = require('../../lib/utils')

const Base = require('./base')

Base.init({ table: 'rifas' })

function find(filters, table){
    let query = `SELECT * FROM ${table}`
    
    if(filters){
        Object.keys(filters).map(key => {

           query += ` ${key}`

           Object.keys(filters[key]).map(field => {
              query += ` ${field} = '${filters[key][field]}'`
           })
        })
    }

    return db.query(query)
}

module.exports = {
    ...Base,
    async create(data, user_id) {
        const query = `
           INSERT INTO rifas(  -- Alterar para 'rifas'
               client_id,
               name,
               numeroBilhetes,
               created_at,
               expire
           ) VALUES ($1, $2, $3, $4, $5)
             RETURNING rifa_id
        `
        const values = [
            user_id,
            data.name,
            data.numeroBilhetes,
            date(Date.now()).iso,
            data.expire || null
        ]
    
        const results = await db.query(query, values)
        return results.rows[0].rifa_id
    },    
    async paginate(params) {
        try {
            const { filter, limit, offset } = params

            let query = "",
                filterQuery = "",
                totalQuery = `(
                    SELECT count(*) FROM rifas
                ) AS total`

            if (filter) {
                filterQuery = `${query}
                WHERE Rifa.name ILIKE '%${filter}%'
                
                `
                totalQuery = `(
                    SELECT count(*) FROM rifas
                    ${filterQuery}
                ) AS total`
            }

            query = `
            SELECT rifas.*, ${totalQuery}
            FROM rifas
            
            ${filterQuery}
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
            
            `

            const results = await db.query(query, [limit, offset])
            return results.rows
        } catch (err) {
            console.error(err)
        }
    },
    async paginateResults(params) {
        try {
            const { filter, limit, offset } = params

            let query = "",
                filterQuery = "",
                totalQuery = `(
                    SELECT count(*) FROM rifas
                ) AS total`

            if (filter) {
                filterQuery = `${query}
                WHERE rifas.name ILIKE '%${filter}%'
                
                `
                totalQuery = `(
                    SELECT count(*) FROM rifas
                    ${filterQuery}
                ) AS total`
            }

            query = `
            SELECT rifas.*, ${totalQuery}
            FROM rifas
            
            ${filterQuery}
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
            
            `

            const results = await db.query(query, [limit, offset])
            return results.rows
        } catch (err) {
            console.error(err)
        }
    },
    async files(id) {
        try {
            const results = await db.query(`SELECT * FROM files
            LEFT JOIN recipe_files
            ON (files.id = recipe_files.file_id)
            WHERE recipe_files.rifa_id = $1`, [id])
            return results.rows
        } catch (err) {
            console.log(err)
        }
    },
    async delete(id){
        return db.query(`DELETE FROM ${this.table} WHERE rifa_id = $1`, [id])
     },
    async update(data){
        try {
            const { name, id} = data
            await db.query(`
                UPDATE "rifas"
                SET "name" = $1
                WHERE "rifa_id" = $2
            `, [name, id])

        } catch (error) {
            console.error(error)
        }
     },
     async find(rifa_id){
        const results = await find({ where: {rifa_id} }, this.table)
        return results.rows[0]
     }
}
