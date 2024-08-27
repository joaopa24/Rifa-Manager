const Rifa = require('../models/rifa') // Certifique-se de que o caminho está correto

async function getImages(rifaId) {
    try {
        let files = await Rifa.files(rifaId)
        files = files.map(file => ({
            ...file,
            src: `${file.path.replace("public", "")}`
        }))
    
        return files
    } catch (error) {
        console.error(`Error getting images for rifa ${rifaId}:`, error)
        return []
    }
}

async function format(rifa) {
    if (!rifa) return null;

    try {
        const files = await getImages(rifa.rifa_id)
        rifa.files = files
        rifa.image = files[0] || null

        return rifa
    } catch (error) {
        console.error('Error formatting rifa:', error)
        return null
    }
}

const LoadService = {
    filter: {},

    async load(service, filter) {
        this.filter = filter || {}

        if (typeof this[service] !== 'function') {
            throw new Error(`Service method ${service} not found`)
        }

        return this[service]()
    },

    async rifa() {
        try {
            const rifa = await Rifa.findOne(this.filter)
            return await format(rifa)
        } catch (error) {
            console.error('Error loading rifa:', error)
            return null
        }
    },
    
    async rifasMy() {
        try {
            const rifas = await Rifa.find(this.filter);
            const rifasFormatted = await Promise.all(rifas.map(format));
            return rifasFormatted;
        } catch (error) {
            console.error('Error loading rifas:', error);
            return [];
        }
    },
    
    async rifasMy() {
        try {
            const rifas = await Rifa.find(this.filter)

            const rifasFormatted = await Promise.all(rifas.map(format))

            return rifasFormatted
        } catch (error) {
            console.error('Error loading rifas:', error)
            return []
        }
    },

    async rifas() {
        try {
            const rifas = await Rifa.findAll(this.filter)

            const rifasFormatted = await Promise.all(rifas.map(format))

            return rifasFormatted
        } catch (error) {
            console.error('Error loading rifas:', error)
            return []
        }
    },

    format
}

module.exports = LoadService
