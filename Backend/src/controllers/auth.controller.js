import * as auth_services from '../services/auth.services.js'

export async function register(request, response, next) {
    try {
        const { nombre, email, password } = request.body
        const result = await auth_services.registerUser(nombre, email, password)

        return response.status(201).json({
            ok: true,
            status: 201,
            message: result.email_sent
                ? 'Usuario registrado con éxito. Hemos enviado un correo para verificar tu cuenta.'
                : 'Usuario registrado con éxito. Si no recibiste el correo por falta de configuración de Gmail en el servidor, puedes activar tu cuenta con el enlace facilitado.',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export async function login(request, response, next) {
    try {
        const { email, password } = request.body
        const result = await auth_services.loginUser(email, password)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Inicio de sesión exitoso',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export async function verifyEmail(request, response, next) {
    try {
        const { token } = request.query
        const result = await auth_services.verifyEmailToken(token)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: result.message
        })
    } catch (error) {
        next(error)
    }
}

export async function resendVerification(request, response, next) {
    try {
        const { email } = request.params
        const result = await auth_services.resendVerificationEmail(email)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Si el correo está registrado y pendiente de validación, recibirás un nuevo enlace.',
            data: result || {}
        })
    } catch (error) {
        next(error)
    }
}

export async function forgotPassword(request, response, next) {
    try {
        const { email } = request.body
        const result = await auth_services.forgotPassword(email)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Si el correo existe en nuestra plataforma, hemos enviado instrucciones para restablecer tu contraseña.',
            data: result || {}
        })
    } catch (error) {
        next(error)
    }
}

export async function resetPassword(request, response, next) {
    try {
        const { token, password } = request.body
        const result = await auth_services.resetPasswordWithToken(token, password)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: result.message
        })
    } catch (error) {
        next(error)
    }
}

export async function getMe(request, response, next) {
    try {
        const user = await auth_services.getProfile(request.user.id)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Perfil de usuario obtenido con éxito',
            data: { user }
        })
    } catch (error) {
        next(error)
    }
}
