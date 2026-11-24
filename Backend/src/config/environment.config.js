import dotenv from 'dotenv'

dotenv.config()

const ENVIRONMENT = {
    PORT: process.env.PORT || 8080,
    MONGO_DB_URI: process.env.MONGO_DB_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'gestor_tareas_utn',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'utn_pwa_default_secret_key_2026',
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    URL_BACKEND: process.env.URL_BACKEND || 'http://localhost:8080',
    URL_FRONTEND: process.env.URL_FRONTEND || 'http://localhost:5173'
}

export default ENVIRONMENT
