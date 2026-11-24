import mongoose from 'mongoose'
import ENVIRONMENT from './environment.config.js'

let isConnected = false

export default async function connectMongoDB() {
    if (isConnected && mongoose.connection.readyState === 1) {
        return
    }

    try {
        const uri = ENVIRONMENT.MONGO_DB_URI
        if (!uri || /usuario:password@|<|>/i.test(uri)) {
            throw new Error('MONGO_DB_URI no está configurada correctamente. Reemplaza el valor de ejemplo por una conexión MongoDB válida.')
        }

        await mongoose.connect(uri, {
            dbName: ENVIRONMENT.MONGO_DB_NAME,
            serverSelectionTimeoutMS: 5000
        })

        isConnected = true
        console.log('[MongoDB] Conexión establecida exitosamente con la base de datos:', ENVIRONMENT.MONGO_DB_NAME)
    } catch (error) {
        isConnected = false
        console.error('[MongoDB] Error al conectar a MongoDB:', error.message)
        throw error
    }
}
