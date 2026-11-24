import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import ENVIRONMENT from './config/environment.config.js'
import connectMongoDB from './config/mongo.config.js'
import openapiSpec from './docs/openapi.config.js'
import auth_router from './routes/auth.router.js'
import project_router from './routes/project.router.js'
import task_router from './routes/task.router.js'
import errorHandlerMiddleware from './middlewares/error.middleware.js'

const app = express()
const PORT = ENVIRONMENT.PORT

// Middlewares globales
app.use(cors({
    origin: ENVIRONMENT.URL_FRONTEND === '*' ? '*' : [
        ENVIRONMENT.URL_FRONTEND,
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Documentación con Swagger UI
app.get('/api/docs/openapi.json', (request, response) => {
    response.json(openapiSpec)
})
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec))

// Ruta de healthcheck
app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'CheckWork API REST está operativa',
        docs: '/api/docs'
    })
})

// Middleware de conexión a la base de datos MongoDB
app.use(async (req, res, next) => {
    try {
        await connectMongoDB()
        next()
    } catch (error) {
        console.error('[MongoDB Connection Error]:', error.message)
        res.status(503).json({
            ok: false,
            status: 503,
            message: 'No se pudo conectar a la base de datos. Por favor verifica tu MONGO_DB_URI en Backend/.env e intenta más tarde.'
        })
    }
})

// Rutas montadas de la API
app.use('/api/auth', auth_router)
app.use('/api/projects', project_router)
app.use('/api/tasks', task_router)

// Middleware centralizado de gestión de errores
app.use(errorHandlerMiddleware)

// Inicio del servidor
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`====================================================`)
        console.log(`🚀 Servidor CheckWork escuchando en http://localhost:${PORT}`)
        console.log(`📖 Documentación Swagger UI en: http://localhost:${PORT}/api/docs`)
        console.log(`====================================================`)
    })
}

export default app
