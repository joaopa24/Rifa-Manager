const db = require('../../config/db');
const fs = require('fs');
const path = require('path'); // Adicionado para garantir que o caminho do arquivo seja corretamente resolvido

const Base = require('./base');

module.exports = {
    ...Base,

    create({ filename, path }) {
        const query = `
        INSERT INTO files (
            name,
            path
        ) VALUES ($1, $2)
        RETURNING id 
        `
        const values = [
            filename,
            path
        ]
        return db.query(query,values)
    },

    RecipeFiles({recipe_id, file_id}){
        const query = `
        INSERT INTO recipe_files (
           rifa_id,
           file_id
        ) VALUES ($1, $2)
        RETURNING id
        `
        const values = [
            recipe_id,
            file_id
        ]
        return db.query(query,values)
    },

    async delete(id) {
        try {
            // Obtém a associação do arquivo com a rifa
            const recipesFilesQuery = `SELECT * FROM recipe_files WHERE file_id = $1`;
            const recipesFiles = await db.query(recipesFilesQuery, [id]);
            
            // Verifica se o arquivo está associado a alguma rifa
            if (recipesFiles.rows.length > 0) {
                const recipeFile = recipesFiles.rows[0];

                // Obtém o caminho do arquivo
                const fileQuery = `SELECT * FROM files WHERE id = $1`;
                const fileResult = await db.query(fileQuery, [recipeFile.file_id]);
                const file = fileResult.rows[0];

                // Remove o arquivo do sistema de arquivos
                fs.unlinkSync(path.resolve(file.path));

                // Remove a associação e o arquivo
                await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id]);
                await db.query(`DELETE FROM files WHERE id = $1`, [recipeFile.file_id]);
            } else {
                // Caso o arquivo não esteja associado a nenhuma rifa
                console.warn("Arquivo não está associado a nenhuma rifa.");
                await db.query(`DELETE FROM files WHERE id = $1`, [id]);
            }
        } catch (error) {
            console.error("Erro ao excluir arquivo:", error);
            throw new Error("Erro ao excluir arquivo");
        }
    },

    async chefDelete(id) {
        try {
            // Obtém o arquivo a ser excluído
            const fileQuery = `SELECT * FROM files WHERE id = $1`;
            const result = await db.query(fileQuery, [id]);
            const file = result.rows[0];

            if (file) {
                // Remove o arquivo do sistema de arquivos
                fs.unlinkSync(path.resolve(file.path));

                // Remove o registro do arquivo
                await db.query(`DELETE FROM files WHERE id = $1`, [id]);
            } else {
                console.warn("Arquivo não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao excluir arquivo:", error);
            throw new Error("Erro ao excluir arquivo");
        }
    }
};
