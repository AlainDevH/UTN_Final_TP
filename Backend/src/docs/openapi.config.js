import swaggerJSDoc from 'swagger-jsdoc'

const openapiDefinition = {
    openapi: '3.1.0',
    info: {
        title: 'CheckWork API - UTN PWA',
        version: '1.0.0',
        description:
            'API REST para Gestor de Tareas y Proyectos con arquitectura en capas.\n\n' +
            '**Formato de respuesta uniforme**:\n' +
            '- Éxito: `{ ok: true, status, message, data? }`\n' +
            '- Error: `{ ok: false, status, message }`\n\n' +
            '**Autenticación**: JWT Bearer token en el encabezado `Authorization: Bearer <token>`.\n' +
            'Obtén el token al iniciar sesión con `POST /api/auth/login`.'
    },
    servers: [
        {
            url: 'http://localhost:8080',
            description: 'Servidor Local de Desarrollo'
        }
    ],
    tags: [
        { name: 'Auth', description: 'Registro, Login, Verificación de Email y Recuperación de Contraseña' },
        { name: 'Projects', description: 'CRUD de Proyectos (Entidad Relacionada)' },
        { name: 'Tasks', description: 'CRUD de Tareas (Entidad Principal con relación a Proyectos)' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Introduce el token JWT obtenido del login.'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '65f1234567890abcdef12345' },
                    nombre: { type: 'string', example: 'Juan Pérez' },
                    email: { type: 'string', example: 'juan@example.com' },
                    activo: { type: 'boolean', example: true },
                    email_verificado: { type: 'boolean', example: true },
                    fecha_creacion: { type: 'string', format: 'date-time' }
                }
            },
            Project: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '65f1234567890abcdef12346' },
                    nombre: { type: 'string', example: 'Rediseño Web UTN' },
                    descripcion: { type: 'string', example: 'Proyecto final de cátedra PWA' },
                    color: { type: 'string', example: '#4f46e5' },
                    estado: { type: 'string', enum: ['activo', 'archivado', 'completado'], example: 'activo' },
                    fk_id_usuario: { type: 'string', example: '65f1234567890abcdef12345' },
                    fecha_creacion: { type: 'string', format: 'date-time' },
                    total_tareas: { type: 'integer', example: 5 },
                    tareas_completadas: { type: 'integer', example: 2 }
                }
            },
            Task: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '65f1234567890abcdef12347' },
                    titulo: { type: 'string', example: 'Crear componentes React' },
                    descripcion: { type: 'string', example: 'Diseñar e implementar botones e inputs' },
                    estado: { type: 'string', enum: ['pendiente', 'en_progreso', 'completada'], example: 'en_progreso' },
                    prioridad: { type: 'string', enum: ['baja', 'media', 'alta', 'urgente'], example: 'alta' },
                    fecha_limite: { type: 'string', format: 'date-time', nullable: true },
                    fk_id_proyecto: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            nombre: { type: 'string', example: 'Rediseño Web UTN' },
                            color: { type: 'string', example: '#4f46e5' }
                        }
                    },
                    fk_id_usuario: { type: 'string', example: '65f1234567890abcdef12345' },
                    fecha_creacion: { type: 'string', format: 'date-time' }
                }
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    ok: { type: 'boolean', example: false },
                    status: { type: 'integer', example: 400 },
                    message: { type: 'string', example: 'Mensaje descriptivo del error' }
                }
            }
        }
    }
}

const options = {
    definition: openapiDefinition,
    apis: ['./src/routes/*.js']
}

const openapiSpec = swaggerJSDoc(options)
export default openapiSpec
