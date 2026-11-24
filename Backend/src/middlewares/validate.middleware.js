import ServerError from '../utils/error.util.js'

/*
Middleware de validación de entrada genérico para comprobar campos requeridos en el body
*/
export function validateRequiredFields(fields = []) {
    return (request, response, next) => {
        const body = request.body || {}
        const missing = []

        for (const field of fields) {
            if (body[field] === undefined || body[field] === null || (typeof body[field] === 'string' && !body[field].trim())) {
                missing.push(field)
            }
        }

        if (missing.length > 0) {
            throw new ServerError(`Los siguientes campos son requeridos: ${missing.join(', ')}`, 400)
        }

        next()
    }
}
