/*
Middleware centralizado para el manejo de errores.
Captura errores de tipo ServerError con código HTTP y excepciones no controladas.
*/
export default function errorHandlerMiddleware(error, request, response, next) {
    if (error.status) {
        return response.status(error.status).json({
            ok: false,
            status: error.status,
            message: error.message
        })
    }

    // Errores de casteo de Mongoose (ID de MongoDB inválido)
    if (error.name === 'CastError') {
        return response.status(400).json({
            ok: false,
            status: 400,
            message: `El identificador '${error.value}' tiene un formato inválido`
        })
    }

    // Error de clave duplicada en Mongo (E11000)
    if (error.code === 11000) {
        return response.status(400).json({
            ok: false,
            status: 400,
            message: 'Ya existe un registro con esos datos únicos'
        })
    }

    // Errores de validación de esquemas Mongoose
    if (error.name === 'ValidationError') {
        const message = Object.values(error.errors || {})
            .map(validationError => validationError.message)
            .join('. ')

        return response.status(400).json({
            ok: false,
            status: 400,
            message: message || 'Los datos enviados no son válidos'
        })
    }

    console.error('[Error inesperado]:', error)

    return response.status(500).json({
        ok: false,
        status: 500,
        message: 'Error interno del servidor'
    })
}
