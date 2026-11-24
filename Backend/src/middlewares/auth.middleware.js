import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.config.js'
import ServerError from '../utils/error.util.js'

export default function authMiddleware(request, response, next) {
    try {
        const authHeader = request.headers.authorization
        if (!authHeader) {
            throw new ServerError('Encabezado de autorización requerido (Authorization: Bearer <token>)', 400)
        }

        const parts = authHeader.split(' ')
        if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
            throw new ServerError('Formato de autorización inválido. Debe ser: Bearer <token>', 400)
        }

        const token = parts[1]

        let payload
        try {
            payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return response.status(401).json({
                    ok: false,
                    status: 401,
                    message: 'El token de sesión ha expirado'
                })
            }
            return response.status(401).json({
                ok: false,
                status: 401,
                message: 'Token de sesión inválido'
            })
        }

        request.user = {
            id: payload.id,
            nombre: payload.nombre,
            email: payload.email
        }

        next()
    } catch (error) {
        next(error)
    }
}
