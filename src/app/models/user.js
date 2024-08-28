const db = require('../../config/db')
const { hash } = require('bcryptjs')

const Base = require('./base')

Base.init({ table:'users' })

module.exports = {
       ...Base,
       async create(data, passwordhashed) {
              const query = `
                 INSERT INTO users(  -- Alterar para 'rifas'
                     name,
                     email,
                     password,
                     cpf,
                     celular
                 ) VALUES ($1, $2, $3, $4, $5)
                   RETURNING id
              `
              const values = [
                  data.name,
                  data.email,
                  passwordhashed,
                  data.cpf,
                  data.celular,
              ]
          
              const results = await db.query(query, values)
              return results.rows[0].id
          },
          delete(id){
            return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
          }
}